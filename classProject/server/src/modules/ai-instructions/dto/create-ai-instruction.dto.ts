import {
  IsString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AiInstructionStatus } from '../ai-instruction.schema';

export class CreateAiInstructionDto {
  @IsMongoId()
  elderId: string;

  @IsMongoId()
  createdBy: string;

  @IsString()
  message: string;

  @IsString()
  aiResponse: string;

  @IsEnum(AiInstructionStatus)
  status: AiInstructionStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  appliedAt?: Date;

  @IsMongoId()
  @IsOptional()
  callId?: string;
}
