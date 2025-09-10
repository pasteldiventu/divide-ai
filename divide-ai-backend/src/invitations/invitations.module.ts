import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsService } from './invitation.service';
import { InvitationsController } from './invitations.controller';
import { Invitation } from '../groups/entities/invitation.entity';
import { Membership } from '../groups/entities/membership.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, Membership]),
    UsersModule, 
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService], 
})
export class InvitationsModule {}