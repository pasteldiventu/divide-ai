import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Group } from './group.entity';
  
  export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
  }
  
  @Entity('invitations')
  export class Invitation {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    groupId: number;
  
    @ManyToOne(() => Group, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'groupId' })
    group: Group;
  
    @Column()
    inviterId: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'inviterId' })
    inviter: User; // Quem convidou
  
    @Column()
    inviteeId: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'inviteeId' })
    invitee: User; // Quem foi convidado
  
    @Column({
      type: 'enum',
      enum: InvitationStatus,
      default: InvitationStatus.PENDING,
    })
    status: InvitationStatus;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }