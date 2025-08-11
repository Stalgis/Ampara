import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AiInstructionsService } from './ai-instructions.service';
import { CreateAiInstructionDto } from './dto/create-ai-instruction.dto';
import { UpdateAiInstructionDto } from './dto/update-ai-instruction.dto';

@Controller('ai-instructions')
export class AiInstructionsController {
  constructor(private readonly aiInstructionsService: AiInstructionsService) {}

  @Post()
  create(@Body() createAiInstructionDto: CreateAiInstructionDto) {
    return this.aiInstructionsService.create(createAiInstructionDto);
  }

  @Get()
  findAll() {
    return this.aiInstructionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiInstructionsService.findOne(id);
  }

  @Get('elder/:elderId')
  findByElderId(@Param('elderId') elderId: string) {
    return this.aiInstructionsService.findByElderId(elderId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAiInstructionDto: UpdateAiInstructionDto,
  ) {
    return this.aiInstructionsService.update(id, updateAiInstructionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiInstructionsService.remove(id);
  }
}
