import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Group } from '../../groups/entities/group.entity';
  import { ExpenseSplit } from './expense-split.entity';
  import { SplitMethod } from '../dto/create-expense.dto';
  
  @Entity('expenses')
  export class Expense {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 255 })
    description: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;
  
    @CreateDateColumn()
    date: Date;
  
    @Column()
    payerId: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'payerId' })
    payer: User;
  
    @Column()
    groupId: number;

    @Column({
      type: 'enum',
      enum: SplitMethod,
      default: SplitMethod.EQUAL,
    })
    splitMethod: SplitMethod;
    
    @ManyToOne(() => Group, (group) => group.expenses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'groupId' })
    group: Group;
  
    @OneToMany(() => ExpenseSplit, (split) => split.expense, { cascade: true })
    splits: ExpenseSplit[];
  }
  