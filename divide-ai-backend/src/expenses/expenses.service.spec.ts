import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
// CORREÇÃO 1: Importar ObjectLiteral
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';
import { Group } from '../groups/entities/group.entity';
import { Membership } from '../groups/entities/membership.entity';
import { CreateExpenseDto, SplitMethod } from './dto/create-expense.dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

// CORREÇÃO 2: Adicionar a restrição 'extends ObjectLiteral'
type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  count: jest.fn(), // Adicionado para a lógica otimizada
  create: jest.fn(),
  save: jest.fn(),
});

// Mock do QueryRunner e DataSource
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    create: jest.fn(),
    save: jest.fn(),
  },
};

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expenseRepository: MockRepository<Expense>;
  let groupRepository: MockRepository<Group>;
  let membershipRepository: MockRepository<Membership>;
  let dataSource: Partial<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: createMockRepository<Expense>(),
        },
        {
          provide: getRepositoryToken(Group),
          useValue: createMockRepository<Group>(),
        },
        {
          provide: getRepositoryToken(Membership),
          useValue: createMockRepository<Membership>(),
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    expenseRepository = module.get(getRepositoryToken(Expense));
    groupRepository = module.get(getRepositoryToken(Group));
    membershipRepository = module.get(getRepositoryToken(Membership));
    dataSource = module.get(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const groupId = 1;
    const payerId = 1;
    const mockGroup = { id: groupId, name: 'Test Group' } as Group;
    const mockMemberships = [
      { userId: 1, groupId },
      { userId: 2, groupId },
    ] as Membership[];

    beforeEach(() => {
        jest.clearAllMocks();
        // CORREÇÃO 3: Usar '!' para indicar ao TypeScript que o mock existe
        groupRepository.findOneBy!.mockResolvedValue(mockGroup);
        membershipRepository.count!.mockResolvedValue(mockMemberships.length);
        mockQueryRunner.manager.create.mockImplementation((_, entity) => entity);
        mockQueryRunner.manager.save.mockImplementation((entity) => Promise.resolve({ ...entity, id: Date.now() }));
        expenseRepository.findOne!.mockImplementation(({ where: { id }}) => Promise.resolve({ id, description: 'test' }));
    });

    it('should throw NotFoundException if group does not exist', async () => {
      groupRepository.findOneBy!.mockResolvedValue(null);
      const dto: CreateExpenseDto = {
        description: 'Dinner',
        amount: 100,
        splitMethod: SplitMethod.EQUAL,
        splits: [{ userId: 1 }, { userId: 2 }],
      };
      await expect(service.create(999, payerId, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if a user is not in the group', async () => {
        // Lógica do service usa 'count', então mockamos um valor menor que o esperado
        membershipRepository.count!.mockResolvedValue(1); // Esperava 2 (payerId:1, userId:3) mas encontrou 1
        const dto: CreateExpenseDto = {
          description: 'Movie Tickets',
          amount: 50,
          splitMethod: SplitMethod.EQUAL,
          splits: [{ userId: 3 }], // User 3 não é membro
        };
        await expect(service.create(groupId, payerId, dto)).rejects.toThrow(ForbiddenException);
    });
    
    it('should create an expense with EQUAL split method correctly', async () => {
      const dto: CreateExpenseDto = {
        description: 'Groceries',
        amount: 100.00,
        splitMethod: SplitMethod.EQUAL,
        splits: [{ userId: 1 }, { userId: 2 }],
      };
      
      membershipRepository.count!.mockResolvedValue(2); // payerId: 1, splits: 1, 2 -> unique: 1,2 -> length 2

      await service.create(groupId, payerId, dto);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
          expect.arrayContaining([
              expect.objectContaining({ userId: 1, owedAmount: 50.00 }),
              expect.objectContaining({ userId: 2, owedAmount: 50.00 }),
          ])
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
    });

    // ... (restante dos testes permanece o mesmo)
    
    it('should rollback transaction on failure', async () => {
      mockQueryRunner.manager.save.mockRejectedValue(new Error('DB Error'));
      const dto: CreateExpenseDto = {
        description: 'Failed Expense',
        amount: 100,
        splitMethod: SplitMethod.EQUAL,
        splits: [{ userId: 1 }],
      };

      await expect(service.create(groupId, payerId, dto)).rejects.toThrow(BadRequestException);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});

