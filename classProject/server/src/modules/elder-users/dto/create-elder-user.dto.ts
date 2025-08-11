import {
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PhoneNumberDto {
  @IsString()
  label: string;

  @IsString()
  number: string;
}

export class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  relation: string;

  @IsString()
  phoneNumber: string;
}

export class MedicalInfoDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  conditions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];
}

export class CreateElderUserDto {
  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  @ArrayMinSize(1, { message: 'At least one phone number is required' })
  phoneNumbers: PhoneNumberDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  @IsOptional()
  emergencyContacts?: EmergencyContactDto[];

  @ValidateNested()
  @Type(() => MedicalInfoDto)
  @IsOptional()
  medicalInfo?: MedicalInfoDto;
}
