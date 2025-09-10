import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Group } from './group.entity';
  
  export enum MemberRole {
    ADMIN = 'admin',
    MEMBER = 'member',
  }
  
  @Entity('memberships')
  @Unique(['userId', 'groupId']) 
  export class Membership {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'enum',
      enum: MemberRole,
      default: MemberRole.MEMBER,
    })
    role: MemberRole;
  
    // --- Relacionamentos ---
  
    @Column()
    userId: number;
  
    @Column()
    groupId: number;
  
    @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @ManyToOne(() => Group, (group) => group.memberships, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'groupId' })
    group: Group;
  }
  