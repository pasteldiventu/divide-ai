import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, DataSource } from 'typeorm';
  import { Invitation, InvitationStatus } from '../groups/entities/invitation.entity';
  import { Membership, MemberRole } from '../groups/entities/membership.entity';
  import { UsersService } from '../users/users.service';
  
  @Injectable()
  export class InvitationsService {
    constructor(
      @InjectRepository(Invitation)
      private readonly invitationRepository: Repository<Invitation>,
      @InjectRepository(Membership)
      private readonly membershipRepository: Repository<Membership>,
      private readonly usersService: UsersService,
      private readonly dataSource: DataSource,
    ) {}
  
    async inviteMember(groupId: number, inviterId: number, inviteeEmail: string): Promise<Invitation> {
      const inviterMembership = await this.membershipRepository.findOneBy({ groupId, userId: inviterId });
      if (inviterMembership?.role !== MemberRole.ADMIN) {
        throw new ForbiddenException('Apenas administradores podem convidar novos membros.');
      }
  
      const invitee = await this.usersService.findOneByUseremail(inviteeEmail);
      if (!invitee) {
        throw new NotFoundException(`Usuário com e-mail ${inviteeEmail} não encontrado.`);
      }
      
      if (invitee.id === inviterId) {
        throw new BadRequestException('Você não pode convidar a si mesmo.');
      }
  
      const existingMembership = await this.membershipRepository.findOneBy({ groupId, userId: invitee.id });
      if (existingMembership) {
        throw new ConflictException('Este usuário já é membro do grupo.');
      }
  
      const existingInvitation = await this.invitationRepository.findOneBy({
        groupId,
        inviteeId: invitee.id,
        status: InvitationStatus.PENDING,
      });
      if (existingInvitation) {
        throw new ConflictException('Já existe um convite pendente para este usuário.');
      }
  
      const invitation = this.invitationRepository.create({
        groupId,
        inviterId,
        inviteeId: invitee.id,
      });
  
      return this.invitationRepository.save(invitation);
    }
  
    async findReceivedInvitations(userId: number): Promise<Invitation[]> {
      return this.invitationRepository.find({
        where: {
          inviteeId: userId,
          status: InvitationStatus.PENDING,
        },
        relations: ['group', 'inviter'], // Carrega dados do grupo e de quem convidou
      });
    }
  
    async respondToInvitation(
      invitationId: number,
      userId: number,
      status: InvitationStatus,
    ): Promise<Membership | Invitation> {
      const invitation = await this.invitationRepository.findOneBy({ id: invitationId });
  
      if (!invitation) throw new NotFoundException('Convite não encontrado.');
      if (invitation.inviteeId !== userId) throw new ForbiddenException('Acesso negado a este convite.');
      if (invitation.status !== InvitationStatus.PENDING) throw new BadRequestException('Este convite já foi respondido.');
      if (status !== InvitationStatus.ACCEPTED && status !== InvitationStatus.DECLINED) {
        throw new BadRequestException("Status inválido. Use 'accepted' ou 'declined'.");
      }
      
      if (status === InvitationStatus.ACCEPTED) {
        return this.dataSource.transaction(async (manager) => {
          invitation.status = InvitationStatus.ACCEPTED;
          await manager.save(invitation);
  
          const newMembership = manager.create(Membership, {
            groupId: invitation.groupId,
            userId: invitation.inviteeId,
            role: MemberRole.MEMBER,
          });
          return manager.save(newMembership);
        });
      } else { // status === InvitationStatus.DECLINED
        invitation.status = InvitationStatus.DECLINED;
        return this.invitationRepository.save(invitation);
      }
    }
  }