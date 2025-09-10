import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, SplitMethod } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Mock do ExpensesService
const mockExpensesService = {
  create: jest.fn(),
};

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: typeof mockExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard) // Ignoramos o guard para facilitar os testes unitários
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call expensesService.create with correct parameters', async () => {
      const groupId = 1;
      const createExpenseDto: CreateExpenseDto = {
        description: 'Test Expense',
        amount: 50,
        splitMethod: SplitMethod.EQUAL,
        splits: [{ userId: 2 }],
      };
      
      const mockRequest = {
        user: {
          userId: 1, // Simulando o ID do usuário extraído do token JWT
        },
      };

      // Mock do retorno do serviço
      const result = { id: 1, ...createExpenseDto } as any;
      service.create.mockResolvedValue(result);

      // Executa o método do controller
      const response = await controller.create(groupId, mockRequest, createExpenseDto);

      // Verifica se o serviço foi chamado com os argumentos corretos
      expect(service.create).toHaveBeenCalledWith(
        groupId,
        mockRequest.user.userId,
        createExpenseDto,
      );
      
      expect(response).toEqual(result);
    });
  });
});
