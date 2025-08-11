import { PartialType } from '@nestjs/mapped-types';
import { CreateAdviceRequestDto } from './create-advice-request.dto';

export class UpdateAdviceRequestDto extends PartialType(
  CreateAdviceRequestDto,
) {}
