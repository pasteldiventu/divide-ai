import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses') 
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get(':expenseId')
  @ApiOperation({ summary: 'Buscar uma despesa específica pelo ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da despesa.' })
  findOne(
    @Param('expenseId', ParseIntPipe) expenseId: number,
    @Request() req,
  ) {
    return this.expensesService.findOne(expenseId, req.user.id);
  }

  @Patch(':expenseId')
  @ApiOperation({ summary: 'Atualizar uma despesa existente' })
  @ApiResponse({ status: 200, description: 'Despesa atualizada com sucesso.' })
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
  remove(
    @Param('expenseId', ParseIntPipe) expenseId: number,
    @Request() req,
  ) {
    return this.expensesService.remove(expenseId, req.user.id);
  }
}