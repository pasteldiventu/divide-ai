import { Controller, Get, Post, Body, Param, Patch, ParseIntPipe, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'O usuário foi criado com sucesso.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um usuário existente' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários.', type: [UserResponseDto] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('/by_email/:email')
  @ApiOperation({ summary: 'Buscar um usuário pelo Email' })
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByUseremail(email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um usuário' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
