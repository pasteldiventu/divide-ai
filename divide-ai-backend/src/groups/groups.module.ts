import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { Membership } from './entities/membership.entity';
import { UsersModule } from '../users/users.module';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Membership]),
    UsersModule, // Importamos para ter acesso ao UsersService
    InvitationsModule, // Importado pra ter acesso ao service de invitations
    AuthModule,  // Importamos para usar o JwtAuthGuard
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
