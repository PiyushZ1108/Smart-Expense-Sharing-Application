import { IsString, IsNumber, IsEnum, IsArray, ValidateNested, IsOptional, ArrayNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ParticipantDto {
  @IsString()
  public user: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  public share?: number;
}

export class CreateExpenseDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsNumber()
  @Min(0.01)
  public totalAmount: number;

  @IsString()
  public payer: string;

  @IsEnum(['EQUAL', 'UNEQUAL'])
  public splitType: 'EQUAL' | 'UNEQUAL';

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  public participants: ParticipantDto[];
}
