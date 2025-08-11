import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDate,
  IsMongoId,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AiInstructionStatus } from '../ai-instructions/ai-instruction.schema';
import { CallStatus } from '../calls/call.schema';
import { MoodSource } from '../moods/mood.schema';

export type UserDocument = User & Document;

export enum UserRole {
  FAMILY_MEMBER = 'FAMILY_MEMBER',
  NURSE = 'NURSE',
  VISITOR = 'VISITOR',
  ELDER_USER = 'ELDER_USER',
}

@Schema({ _id: false })
export class PhoneNumber {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  number: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ type: [PhoneNumber], default: [] })
  phoneNumbers: PhoneNumber[];

  @Prop({ type: [Types.ObjectId], ref: 'ElderUser', default: [] })
  linkedElders: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for efficient queries
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ linkedElders: 1 });

export class PhoneNumberDto {
  @ApiProperty({ example: 'Home' })
  @IsString()
  label: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  number: string;
}
export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 8,
    description: 'Password (min 8 chars)',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.FAMILY_MEMBER,
    description: 'User role',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    type: [PhoneNumberDto],
    required: false,
    description: 'List of phone numbers',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  phoneNumbers?: PhoneNumberDto[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'IDs of linked elder users',
  })
  @IsOptional()
  @IsArray()
  linkedElders?: string[];
}

export class EmergencyContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Son' })
  @IsString()
  relation: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string;
}

export class MedicalInfoDto {
  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  conditions?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];
}

export class CreateElderUserDto {
  @ApiProperty({ example: 'Grandma Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1940-01-01', type: String })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ type: [PhoneNumberDto], minItems: 1 })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  @ArrayMinSize(1, { message: 'At least one phone number is required' })
  phoneNumbers: PhoneNumberDto[];

  @ApiProperty({ type: [EmergencyContactDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  @IsOptional()
  emergencyContacts?: EmergencyContactDto[];

  @ApiProperty({ type: MedicalInfoDto, required: false })
  @ValidateNested()
  @Type(() => MedicalInfoDto)
  @IsOptional()
  medicalInfo?: MedicalInfoDto;
}

export class CreateAdviceRequestDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Elder user ID',
  })
  @IsMongoId()
  elderId: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c99',
    description: 'Visitor user ID',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  visitorId?: string;

  @ApiProperty({ example: 'What is the secret to happiness?' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'Be grateful for every day.', required: false })
  @IsString()
  @IsOptional()
  response?: string;

  @ApiProperty({ example: '2024-07-08T12:00:00Z', type: String })
  @IsDate()
  @Type(() => Date)
  askedAt: Date;

  @ApiProperty({
    example: '2024-07-08T13:00:00Z',
    type: String,
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  answeredAt?: Date;
}

export class CreateAiInstructionDto {
  @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
  @IsMongoId()
  elderId: string;

  @ApiProperty({ example: '60d21b4667d0d8992e610c99' })
  @IsMongoId()
  createdBy: string;

  @ApiProperty({ example: "Dad's anniversary is tomorrow" })
  @IsString()
  message: string;

  @ApiProperty({ example: "Got it, I'll congratulate him" })
  @IsString()
  aiResponse: string;

  @ApiProperty({
    enum: AiInstructionStatus,
    example: AiInstructionStatus.PENDING,
  })
  @IsEnum(AiInstructionStatus)
  status: AiInstructionStatus;

  @ApiProperty({
    example: '2024-07-08T13:00:00Z',
    type: String,
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  appliedAt?: Date;

  @ApiProperty({ example: '60d21b4667d0d8992e610c77', required: false })
  @IsMongoId()
  @IsOptional()
  callId?: string;
}

export class CreateCallDto {
  @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
  @IsMongoId()
  elderId: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  dialedNumber: string;

  @ApiProperty({ example: 'CA1234567890abcdef' })
  @IsString()
  providerCallSid: string;

  @ApiProperty({ enum: CallStatus, example: CallStatus.COMPLETED })
  @IsEnum(CallStatus)
  callStatus: CallStatus;

  @ApiProperty({ example: 120 })
  @IsNumber()
  callDuration: number;

  @ApiProperty({
    example: 'https://example.com/recording.mp3',
    required: false,
  })
  @IsString()
  @IsOptional()
  recordingUrl?: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  transcript: string;

  @ApiProperty({ example: 'Summary of the call' })
  @IsString()
  gptSummary: string;

  @ApiProperty({ example: 'Happy' })
  @IsString()
  moodAnalysis: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  instructions?: string[];

  @ApiProperty({ example: '2024-07-08T12:00:00Z', type: String })
  @IsDate()
  @Type(() => Date)
  calledAt: Date;
}

export class CreateMoodDto {
  @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
  @IsMongoId()
  elderId: string;

  @ApiProperty({ enum: MoodSource, example: MoodSource.AUTO })
  @IsEnum(MoodSource)
  source: MoodSource;

  @ApiProperty({ example: 'Happy' })
  @IsString()
  mood: string;

  @ApiProperty({ example: 0.95, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiProperty({ example: '2024-07-08T12:00:00Z', type: String })
  @IsDate()
  @Type(() => Date)
  timestamp: Date;
}
