import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteMemberDto {
  @ApiProperty({
    description: 'O e-mail do usuário a ser convidado para o grupo.',
    example: 'amigo@exemplo.com',
  })
  @IsEmail({}, { message: 'Por favor, forneça um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail do convidado não pode estar vazio.' })
  inviteeEmail: string;
}