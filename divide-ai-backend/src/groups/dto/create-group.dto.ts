import { ApiProperty } from '@nestjs/swagger';
import { GroupStatus } from '../entities/group.entity';
import { IsEnum,IsOptional } from 'class-validator'

export class CreateGroupDto {
  @ApiProperty({
    description: 'O nome do grupo.',
    example: 'Viagem para a praia',
  })
  name: string;

  @ApiProperty({
    description: 'Uma breve descrição sobre o propósito do grupo.',
    example: 'Despesas da viagem de fim de ano.',
    required: false,
  })
  description?: string;

  @IsEnum(GroupStatus)
  @IsOptional()
  status?: GroupStatus
}

