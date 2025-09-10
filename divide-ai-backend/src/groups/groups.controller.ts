import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  UnauthorizedException,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ForbiddenException, // MELHORIA: Importado para autorização
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { InvitationsService } from 'src/invitations/invitation.service';
import { Membership } from './entities/membership.entity'; 

@ApiBearerAuth() 
@ApiTags('Groups')
@UseGuards(JwtAuthGuard)
@Controller('Groups') 
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
    private readonly invitationsService: InvitationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo grupo' })
  @ApiResponse({ status: 201, description: 'Grupo criado com sucesso.'})
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    const creatorEntity = await this.usersService.findEntityById(req.user.id);

    if (!creatorEntity) {
      throw new UnauthorizedException('Usuário criador não encontrado.');
    }

    return this.groupsService.create(createGroupDto, creatorEntity);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os grupos do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de grupos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAllForUser(@Request() req) {
    return this.groupsService.findAllForUser(req.user.id);
  }

  @Post(':id/invitations')
  @ApiOperation({ summary: 'Convidar um usuário para o grupo (requer ser admin)' })
  @ApiResponse({ status: 201, description: 'Convite enviado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Usuário a ser convidado não encontrado.' })
  @ApiResponse({ status: 409, description: 'Usuário já é membro ou já possui um convite.' })
  inviteMember(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() inviteMemberDto: InviteMemberDto, // DTO com { inviteeEmail: string }
    @Request() req,
  ) {
    return this.invitationsService.inviteMember(groupId, req.user.id, inviteMemberDto.inviteeEmail);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um grupo pelo ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do grupo.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (usuário não é membro).' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.groupsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um grupo existente' })
  @ApiResponse({ status: 200, description: 'Grupo atualizado com sucesso.'})
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (usuário não é criador ou admin).' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
    @Request() req,
  ) {
    return this.groupsService.update(id, updateGroupDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um grupo' })
  @ApiResponse({ status: 204, description: 'Grupo removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (usuário não é criador).' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req,) {
    return this.groupsService.remove(id, req.user.id);
  }
}