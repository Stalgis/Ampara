import {
  IsString,
  IsDate,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CallStatus } from '../call.schema';

export class CreateCallDto {
  @IsMongoId()
  elderId: string;

  @IsString()
  dialedNumber: string;

  @IsString()
  providerCallSid: string;

  @IsEnum(CallStatus)
  callStatus: CallStatus;

  @IsNumber()
  callDuration: number;

  @IsString()
  @IsOptional()
  recordingUrl?: string;

  @IsString()
  transcript: string;

  @IsString()
  gptSummary: string;

  @IsString()
  moodAnalysis: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  instructions?: string[];

  @IsDate()
  @Type(() => Date)
  calledAt: Date;
}
