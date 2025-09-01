import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const saltRounds = 10;
    // TODO: Mover a lógica de hash para um hook da entidade ou um serviço de hash
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash, // Salva o hash, não a senha original
    });

    const savedUser = await this.usersRepository.save(user);

    const { passwordHash: _, ...result } = savedUser;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // O preload busca o usuário pelo ID e já mescla os novos dados do DTO nele.
    // Se o usuário não existir, ele retorna undefined.
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Se uma nova senha foi fornecida no DTO, nós geramos um novo hash para ela
    if (updateUserDto.password) {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    const updatedUser = await this.usersRepository.save(user);

    const { passwordHash: _, ...result } = updatedUser;
    return result;
  }

  findAll(): Promise<UserResponseDto[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<UserResponseDto | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByUseremail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async remove(id: number): Promise<void> {
      const result = await this.usersRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }
    }
}
