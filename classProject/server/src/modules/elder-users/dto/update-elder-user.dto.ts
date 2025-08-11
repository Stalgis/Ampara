import { PartialType } from '@nestjs/mapped-types';
import { CreateElderUserDto } from './create-elder-user.dto';

export class UpdateElderUserDto extends PartialType(CreateElderUserDto) {}
