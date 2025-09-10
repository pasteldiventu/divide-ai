import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;
  
  const mockUser: User = { id: 1, name: 'Test User', email: 'test@example.com' } as User;
  const mockRequest = { user: mockUser };

  const mockGroupsService = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
    findOne: jest.fn(),
    addMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard) // Ignora a autenticação real para os testes
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call groupsService.create with correct parameters', () => {
      const createGroupDto = { name: 'Test Group' };
      controller.create(createGroupDto, mockRequest);
      expect(service.create).toHaveBeenCalledWith(createGroupDto, mockUser);
    });
  });

  describe('findAllForUser', () => {
    it('should call groupsService.findAllForUser with correct user id', () => {
        controller.findAllForUser(mockRequest);
        expect(service.findAllForUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOne', () => {
    it('should call groupsService.findOne with correct group id and user id', () => {
        const groupId = 1;
        controller.findOne(groupId, mockRequest);
        expect(service.findOne).toHaveBeenCalledWith(groupId, mockUser.id);
    });
  });

  describe('addMember', () => {
    it('should call groupsService.addMember with correct parameters', () => {
        const groupId = 1;
        const addMemberDto = { userId: 2 };
        controller.addMember(groupId, addMemberDto, mockRequest);
        expect(service.addMember).toHaveBeenCalledWith(groupId, addMemberDto.userId, mockUser.id);
    });
  });

});
