import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({
    description: 'O ID do usuário a ser adicionado ao grupo.',
    example: 2,
  })
  userId: number;
}

