import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { User } from '../users/entities/user.entity';
import { Membership, MemberRole } from './entities/membership.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Cria um novo grupo e, transacionalmente, cria a associação (membership) para o criador.
   */
  async create(createGroupDto: CreateGroupDto, creator: User): Promise<Group> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const groupEntity = queryRunner.manager.create(Group, {
        ...createGroupDto,
        creator: creator,
      });
      const savedGroup = await queryRunner.manager.save(groupEntity);

      const membershipEntity = queryRunner.manager.create(Membership, {
        group: savedGroup,
        user: creator,
        role: MemberRole.ADMIN,
      });
      await queryRunner.manager.save(membershipEntity);

      await queryRunner.commitTransaction();

      const result = await this.groupRepository.findOne({
        where: { id: savedGroup.id },
        relations: ['memberships', 'memberships.user', 'creator'],
      });

      if (!result) {
        throw new InternalServerErrorException(
          'Não foi possível encontrar o grupo após a criação.',
        );
      }
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        `Não foi possível criar o grupo: ${err.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAllForUser(userId: number): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .innerJoin('group.memberships', 'membership')
      .where('membership.userId = :userId', { userId })
      .getMany();
  }

  async findOne(id: number, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['memberships', 'memberships.user', 'creator'],
    });

    if (!group) {
      throw new NotFoundException(`Grupo com ID ${id} não encontrado.`);
    }

    const isMember = group.memberships.some(
      (membership) => membership.user.id === userId,
    );
    if (!isMember) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este grupo.',
      );
    }

    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto, userId: number): Promise<Group> {
    const group = await this.groupRepository.preload({
      id: id,
      ...updateGroupDto,
    });

    if (!group) {
      throw new NotFoundException(`Grupo com ID ${id} não encontrado`);
    }

    if (group.creator.id !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este grupo.');
    }

    const updatedGroup = await this.groupRepository.save(group);

    return updatedGroup;
  } 

  async remove(id: number, userId: number): Promise<void> {
    // Primeiro, busca o grupo e suas despesas para verificar
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['expenses'], 
    });

    if (!group) {
      throw new NotFoundException(`Grupo com ID ${id} não encontrado`);
    }

    if (group.creator.id !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este grupo.');
    }
  
    // Regra de negócio: não permitir exclusão se houver despesas
    if (group.expenses && group.expenses.length > 0) {
      throw new ConflictException('Não é possível excluir um grupo que possui despesas.');
    }

    await this.groupRepository.delete(id);
  }

  /**
   * Adiciona um usuário a um grupo criando um novo registro de Membership.
   */
  async addMember(
    groupId: number,
    userIdToAdd: number,
    requestingUserId: number,
  ): Promise<Group> {
    const group = await this.findOne(groupId, requestingUserId);

    const userToAdd = await this.usersService.findEntityById(userIdToAdd);
    if (!userToAdd) {
      throw new NotFoundException(`Usuário com ID ${userIdToAdd} não encontrado.`);
    }

    const existingMembership = await this.membershipRepository.findOneBy({
      groupId: group.id,
      userId: userToAdd.id,
    });

    if (existingMembership) {
      throw new ConflictException('Este usuário já é membro do grupo.');
    }

    const newMembership = this.membershipRepository.create({
      group: group,
      user: userToAdd,
      role: MemberRole.MEMBER,
    });
    await this.membershipRepository.save(newMembership);

    return this.findOne(groupId, requestingUserId);
  }
}

