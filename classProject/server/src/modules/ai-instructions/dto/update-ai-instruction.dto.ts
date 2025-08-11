import { PartialType } from '@nestjs/mapped-types';
import { CreateAiInstructionDto } from './create-ai-instruction.dto';

export class UpdateAiInstructionDto extends PartialType(
  CreateAiInstructionDto,
) {}
