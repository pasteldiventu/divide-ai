import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    ParseIntPipe,
  } from '@nestjs/common';
  import { ExpensesService } from './expenses.service';
  import { CreateExpenseDto } from './dto/create-expense.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('Expenses') 
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('groups/:groupId/expenses') 
  export class GroupExpensesController {
    constructor(private readonly expensesService: ExpensesService) {}
  
    @Post()
    @ApiOperation({ summary: 'Adicionar uma nova despesa a um grupo' })
    @ApiResponse({ status: 201, description: 'Despesa criada com sucesso.' })
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
    findAllInGroup(
      @Param('groupId', ParseIntPipe) groupId: number,
      @Request() req,
    ) {
      return this.expensesService.findAllInGroup(groupId, req.user.id);
    }
  }