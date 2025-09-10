import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SplitMethod {
  EQUAL = 'equal',
  EXACT = 'exact',
  PERCENTAGE = 'percentage',
}

class SplitDetailDto {
  @ApiProperty({
    description: 'O ID do usuário que faz parte da divisão.',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description:
      "O valor exato que o usuário deve. Usado apenas com o método 'exact'.",
    example: 25.5,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  owedAmount?: number;

  @ApiProperty({
    description:
      "A porcentagem que o usuário deve. Usado apenas com o método 'percentage'.",
    example: 50,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  percentage?: number;
}

export class CreateExpenseDto {
  @ApiProperty({
    description: 'A descrição da despesa.',
    example: 'Jantar no restaurante',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'O valor total da despesa.',
    example: 120.75,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description:
      'A data em que a despesa ocorreu (formato ISO 8601). O padrão é a data atual.',
    example: '2024-09-21T18:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: Date = new Date();

  @ApiProperty({
    description: 'O método de divisão da despesa.',
    enum: SplitMethod,
    example: SplitMethod.EQUAL,
  })
  @IsEnum(SplitMethod)
  @IsNotEmpty()
  splitMethod: SplitMethod;

  @ApiProperty({
    description:
      'Uma lista de objetos detalhando como a despesa deve ser dividida.',
    type: [SplitDetailDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SplitDetailDto)
  splits: SplitDetailDto[];
}

