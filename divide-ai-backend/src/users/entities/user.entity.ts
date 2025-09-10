import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Membership } from '../../groups/entities/membership.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true})
  email: string;

  @Column({ name: 'password_hash', select: false }) 
  passwordHash: string;

  // CORREÇÃO: A relação agora aponta para a entidade Membership
  // Um usuário pode ter muitas "inscrições" (memberships) em grupos.
  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}