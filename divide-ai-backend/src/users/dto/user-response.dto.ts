import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  email: string;

  @ApiProperty()
  createdAt: Date;
}