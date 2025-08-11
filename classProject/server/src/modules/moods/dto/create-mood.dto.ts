import {
  IsString,
  IsDate,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MoodSource } from '../mood.schema';

export class CreateMoodDto {
  @IsMongoId()
  elderId: string;

  @IsEnum(MoodSource)
  source: MoodSource;

  @IsString()
  mood: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;
}
