import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'O email de usuário para login', 
    example: 'joao_silva@email.com' 
  })
  email: string;

  @ApiProperty({ 
    description: 'A senha do usuário', 
    example: 'senhaForte123',
    type: 'string',
    format: 'password'
  })
  password: string;
}
