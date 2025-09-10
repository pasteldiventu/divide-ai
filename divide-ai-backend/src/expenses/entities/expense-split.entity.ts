import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from 'src/users/entities/user.entity';
  import { Expense } from './expense.entity';
  
  @Entity('expense_splits')
  export class ExpenseSplit {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('decimal', { precision: 10, scale: 2 })
    owedAmount: number;
  
    @Column()
    expenseId: number;
  
    @ManyToOne(() => Expense, (expense) => expense.splits, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'expenseId' })
    expense: Expense;
  
    @Column()
    userId: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
  }
  