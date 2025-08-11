import { IsString, IsDate, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdviceRequestDto {
  @IsMongoId()
  elderId: string;

  @IsMongoId()
  @IsOptional()
  visitorId?: string;

  @IsString()
  question: string;

  @IsString()
  @IsOptional()
  response?: string;

  @IsDate()
  @Type(() => Date)
  askedAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  answeredAt?: Date;
}
