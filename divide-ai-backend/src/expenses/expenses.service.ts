import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { CreateExpenseDto, SplitMethod } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Group } from '../groups/entities/group.entity';
import { Membership, MemberRole } from '../groups/entities/membership.entity'; // Adicionado MemberRole

// Define uma interface para o tipo do split calculado para reuso
interface CalculatedSplit {
  userId: number;
  owedAmount: number;
}

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    groupId: number,
    payerId: number,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    console.log('DTO RECEBIDO NO SERVIÇO:', JSON.stringify(createExpenseDto, null, 2));
    const { description, date, amount, splitMethod, splits } = createExpenseDto;

    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      throw new NotFoundException(`Grupo com ID ${groupId} não encontrado.`);
    }

    const memberIds = [...new Set([payerId, ...splits.map((s) => s.userId)])];
    const memberCount = await this.membershipRepository.count({
      where: {
        groupId: groupId,
        userId: In(memberIds),
      },
    });
    if (memberCount !== memberIds.length) {
      throw new ForbiddenException(
        'Um ou mais usuários envolvidos na despesa não pertencem ao grupo.',
      );
    }

    const calculatedSplits = this.calculateSplits(
      amount,
      splitMethod,
      splits,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const expense = queryRunner.manager.create(Expense, {
        description,
        amount,
        date,
        splitMethod,
        payerId,
        groupId,
      });
      const savedExpense = await queryRunner.manager.save(expense);

      const splitEntities = calculatedSplits.map((split) =>
        queryRunner.manager.create(ExpenseSplit, {
          expenseId: savedExpense.id,
          userId: split.userId,
          owedAmount: split.owedAmount,
        }),
      );
      await queryRunner.manager.save(splitEntities);

      await queryRunner.commitTransaction();

      const result = await this.expenseRepository.findOne({
        where: { id: savedExpense.id },
        relations: ['splits', 'payer'],
      });
      
      if (!result) {
        throw new InternalServerErrorException("Não foi possível encontrar a despesa após a criação.");
      }
      
      return result;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Não foi possível criar a despesa: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Lista todas as despesas de um grupo para um usuário autenticado.
   */
  async findAllInGroup(groupId: number, userId: number): Promise<Expense[]> {
    const membership = await this.membershipRepository.findOneBy({ groupId, userId });
    if (!membership) {
      throw new ForbiddenException('Você não tem permissão para ver as despesas deste grupo.');
    }

    return this.expenseRepository.find({
      where: { groupId },
      relations: ['payer', 'splits'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Busca uma despesa específica, validando o acesso do usuário.
   */
  async findOne(expenseId: number, userId: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['splits', 'payer', 'group', 'group.memberships'],
    });

    if (!expense) {
      throw new NotFoundException(`Despesa com ID ${expenseId} não encontrada.`);
    }

    const isMember = expense.group.memberships.some(m => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Você não tem permissão para acessar esta despesa.');
    }

    const { group, ...result } = expense;
    return result as Expense;
  }

  /**
   * Atualiza uma despesa. Apenas o pagador ou um admin do grupo pode atualizar.
   */
  async update(
    expenseId: number,
    userId: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.dataSource.transaction(async (entityManager) => {
      const expenseRepo = entityManager.getRepository(Expense);
      const expense = await expenseRepo.findOne({
        where: { id: expenseId },
        relations: ['group.memberships'],
      });

      if (!expense) {
        throw new NotFoundException(`Despesa com ID ${expenseId} não encontrada.`);
      }

      // Lógica de Autorização
      const userMembership = expense.group.memberships.find(m => m.userId === userId);
      const isPayer = expense.payerId === userId;
      const isAdmin = userMembership?.role === MemberRole.ADMIN;

      if (!isPayer && !isAdmin) {
        throw new ForbiddenException('Você não tem permissão para atualizar esta despesa.');
      }

      // Se o valor ou a forma de divisão mudou, recalcula e substitui os splits
      if (updateExpenseDto.amount !== undefined || updateExpenseDto.splitMethod || updateExpenseDto.splits) {
        // Usa os dados do DTO ou os existentes na despesa como fallback
        const amount = updateExpenseDto.amount ?? expense.amount;
        const method = updateExpenseDto.splitMethod ?? expense.splitMethod;
        const splits = updateExpenseDto.splits ?? [];

        const calculatedSplits = this.calculateSplits(amount, method, splits);
        
        await entityManager.delete(ExpenseSplit, { expenseId: expense.id });
        const newSplitEntities = calculatedSplits.map(split => 
          entityManager.create(ExpenseSplit, { ...split, expenseId: expense.id })
        );
        await entityManager.save(newSplitEntities);
      }
      
      // Atualiza os dados da despesa principal
      const { splits, ...updateData } = updateExpenseDto; 
      await expenseRepo.update(expenseId, updateData);
      
      // Retorna a entidade completa e atualizada
      return this.findOne(expenseId, userId);
    });
  }

  /**
   * Remove uma despesa (soft delete). Apenas o pagador ou um admin pode remover.
   */
  async remove(expenseId: number, userId: number): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['group.memberships'],
    });

    if (!expense) {
      throw new NotFoundException(`Despesa com ID ${expenseId} não encontrada.`);
    }
    
    // Lógica de Autorização
    const userMembership = expense.group.memberships.find(m => m.userId === userId);
    const isPayer = expense.payerId === userId;
    const isAdmin = userMembership?.role === MemberRole.ADMIN;

    if (!isPayer && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para remover esta despesa.');
    }

    await this.expenseRepository.softDelete(expenseId);
  }


  private calculateSplits(
    // ... (seu método calculateSplits existente, que já está excelente, permanece aqui sem alterações) ...
    totalAmount: number,
    method: SplitMethod,
    splits: { userId: number; owedAmount?: number; percentage?: number }[],
  ): CalculatedSplit[] {
    let calculatedSplits: CalculatedSplit[] = [];
    let totalFromSplits = 0;

    switch (method) {
      case SplitMethod.EQUAL:
        const splitCount = splits.length;
        if (splitCount === 0) throw new BadRequestException("Divisão igual precisa de pelo menos um participante.");
        const owedAmount = Math.round((totalAmount / splitCount) * 100) / 100;
        let remainder = totalAmount - owedAmount * splitCount;

        calculatedSplits = splits.map((split, index) => {
            let finalAmount = owedAmount;
            if (remainder !== 0 && index === 0) {
                finalAmount = parseFloat((owedAmount + remainder).toFixed(2));
            }
            return { userId: split.userId, owedAmount: finalAmount };
        });
        break;

      case SplitMethod.EXACT:
        calculatedSplits = splits.map((s) => {
          if (s.owedAmount === undefined || s.owedAmount === null) {
            throw new BadRequestException(`Para o método 'exact', owedAmount é obrigatório para o usuário ${s.userId}.`);
          }
          return { userId: s.userId, owedAmount: s.owedAmount };
        });

        totalFromSplits = calculatedSplits.reduce((sum, s) => sum + s.owedAmount, 0);
        if (Math.abs(totalAmount - totalFromSplits) > 0.01) {
          throw new BadRequestException(`A soma das divisões (${totalFromSplits.toFixed(2)}) não corresponde ao valor total da despesa (${totalAmount.toFixed(2)}).`);
        }
        break;

      case SplitMethod.PERCENTAGE:
        const totalPercentage = splits.reduce((sum, s) => sum + (s.percentage || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.1) {
          throw new BadRequestException(`A soma das porcentagens (${totalPercentage}) deve ser 100.`);
        }
        
        calculatedSplits = splits.map((s) => {
            if (!s.percentage) {
                 throw new BadRequestException(`Para o método 'percentage', percentage é obrigatório para o usuário ${s.userId}.`);
            }
            const owed = parseFloat(((totalAmount * s.percentage) / 100).toFixed(2));
            return { userId: s.userId, owedAmount: owed };
        });
        
        totalFromSplits = calculatedSplits.reduce((sum, s) => sum + s.owedAmount, 0);
        let diff = parseFloat((totalAmount - totalFromSplits).toFixed(2));
        if (diff !== 0) {
            calculatedSplits[0].owedAmount = parseFloat((calculatedSplits[0].owedAmount + diff).toFixed(2));
        }

        break;
      
      default:
        throw new BadRequestException('Método de divisão inválido.');
    }
    
    return calculatedSplits;
  }
}