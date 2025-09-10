import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
    Request,
    ParseIntPipe,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { InvitationsService } from './invitation.service';
  import { RespondInvitationDto } from './dto/respond-invitation.dto';
  
  @ApiTags('Invitations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('invitations')
  export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}
  
    @Get('/received')
    @ApiOperation({ summary: 'Listar convites pendentes recebidos pelo usuário' })
    @ApiResponse({ status: 200, description: 'Lista de convites pendentes.' })
    findReceived(@Request() req) {
      return this.invitationsService.findReceivedInvitations(req.user.id);
    }
  
    @Patch(':id/respond')
    @ApiOperation({ summary: 'Aceitar ou recusar um convite' })
    @ApiResponse({ status: 200, description: 'Resposta ao convite registrada.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({ status: 404, description: 'Convite não encontrado.' })
    respond(
      @Param('id', ParseIntPipe) invitationId: number,
      @Body() respondDto: RespondInvitationDto, // DTO com { status: 'accepted' | 'declined' }
      @Request() req,
    ) {
      return this.invitationsService.respondToInvitation(invitationId, req.user.id, respondDto.status);
    }
  }