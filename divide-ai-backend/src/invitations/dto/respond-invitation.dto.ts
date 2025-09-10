import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { InvitationStatus } from '../../groups/entities/invitation.entity';

export class RespondInvitationDto {
  @ApiProperty({
    description: "A resposta ao convite ('accepted' ou 'declined').",
    enum: [InvitationStatus.ACCEPTED, InvitationStatus.DECLINED],
    example: InvitationStatus.ACCEPTED,
  })
  @IsEnum(InvitationStatus, {
    message: "O status deve ser 'accepted' ou 'declined'.",
  })
  @IsNotEmpty({ message: 'O status não pode estar vazio.' })
  status: InvitationStatus;
}