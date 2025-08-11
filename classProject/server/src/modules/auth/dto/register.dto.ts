import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { UserRole } from '../../users/users.schema';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsArray()
  phoneNumbers?: Array<{ label: string; number: string }>;

  @IsOptional()
  @IsArray()
  linkedElders?: string[];
}
