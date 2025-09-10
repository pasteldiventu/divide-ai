import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups/:groupId/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar uma nova despesa a um grupo' })
  @ApiResponse({ status: 201, description: 'Despesa criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (usuário não é membro).' })
  create(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Request() req,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(groupId, req.user.id, createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as despesas de um grupo' })
  @ApiResponse({ status: 200, description: 'Lista de despesas do grupo.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  findAllInGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Request() req,
  ) {
    return this.expensesService.findAllInGroup(groupId, req.user.id);
  }

  @Get(':expenseId')
  @ApiOperation({ summary: 'Buscar uma despesa específica pelo ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da despesa.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  findOne(
    @Param('expenseId', ParseIntPipe) expenseId: number,
    @Request() req,
  ) {

    return this.expensesService.findOne(expenseId, req.user.id);
  }

  @Patch(':expenseId')
  @ApiOperation({ summary: 'Atualizar uma despesa existente' })
  @ApiResponse({ status: 200, description: 'Despesa atualizada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (usuário não é pagador ou admin).' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  update(
    @Param('expenseId', ParseIntPipe) expenseId: number,
    @Request() req,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(expenseId, req.user.id, updateExpenseDto);
  }

  @Delete(':expenseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma despesa (exclusão lógica)' })
  @ApiResponse({ status: 204, description: 'Despesa removida com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (usuário não é pagador ou admin).' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  remove(
    @Param('expenseId', ParseIntPipe) expenseId: number,
    @Request() req,
  ) {
    return this.expensesService.remove(expenseId, req.user.id);
  }
}