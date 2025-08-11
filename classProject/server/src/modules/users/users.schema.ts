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
} from 'class-validator';
import { Type } from 'class-transformer';

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
