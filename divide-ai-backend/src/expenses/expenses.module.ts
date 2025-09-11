import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { Group } from '../groups/entities/group.entity';
import { Membership } from 'src/groups/entities/membership.entity';
import { AuthModule } from '../auth/auth.module';
import { GroupExpensesController } from './group-expenses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseSplit, Group, Membership]),
    AuthModule,
  ],
  controllers: [ExpensesController,GroupExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService], 
})
export class ExpensesModule {}
