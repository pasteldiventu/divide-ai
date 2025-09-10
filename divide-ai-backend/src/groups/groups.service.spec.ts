import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

// Mock do usuário para os testes
const testUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  passwordHash: 'hashedpassword',
  createdAt: new Date(),
  groups: [],
};

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepository: Repository<Group>;
  let usersService: UsersService;

  // Mock do repositório e serviços
  const mockGroupRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
    })),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: mockGroupRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new group with the creator as the first member', async () => {
      const createGroupDto = { name: 'New Group', description: 'A test group' };
      const createdGroup = {
        id: 1,
        ...createGroupDto,
        creator: testUser,
        members: [testUser],
      };

      mockGroupRepository.create.mockReturnValue(createdGroup);
      mockGroupRepository.save.mockResolvedValue(createdGroup as any);

      const result = await service.create(createGroupDto, testUser);

      expect(mockGroupRepository.create).toHaveBeenCalledWith({
        ...createGroupDto,
        creator: testUser,
        members: [testUser],
      });
      expect(mockGroupRepository.save).toHaveBeenCalledWith(createdGroup);
      expect(result).toEqual(createdGroup);
    });
  });

  describe('findOne', () => {
    it('should return a group if user is a member', async () => {
        const group = { id: 1, name: 'Test Group', members: [testUser] };
        mockGroupRepository.findOne.mockResolvedValue(group);

        const result = await service.findOne(1, testUser.id);
        expect(result).toEqual(group);
        expect(mockGroupRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['members', 'creator'],
        });
    });

    it('should throw NotFoundException if group does not exist', async () => {
        mockGroupRepository.findOne.mockResolvedValue(null);
        await expect(service.findOne(1, testUser.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not a member', async () => {
        const group = { id: 1, name: 'Test Group', members: [{id: 2, name: 'Other User'}] };
        mockGroupRepository.findOne.mockResolvedValue(group as any);

        await expect(service.findOne(1, testUser.id)).rejects.toThrow(ForbiddenException);
    });
  });

});
