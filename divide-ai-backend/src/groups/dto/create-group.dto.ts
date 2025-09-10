import { ApiProperty } from '@nestjs/swagger';

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
}

