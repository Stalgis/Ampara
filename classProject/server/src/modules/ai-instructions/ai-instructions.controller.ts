import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AiInstructionsService } from './ai-instructions.service';
import { AiInstruction } from './ai-instructions.schema';

@Controller('ai-instructions')
export class AiInstructionsController {
  constructor(private readonly aiInstructionsService: AiInstructionsService) {}

  @Post()
  async create(
    @Body() createAiInstructionDto: Partial<AiInstruction>,
  ): Promise<AiInstruction> {
    const { elderId, createdBy, message, aiResponse } = createAiInstructionDto;
    return this.aiInstructionsService.createInstruction(
      elderId,
      createdBy,
      message,
      aiResponse,
    );
  }

  @Get()
  async findAll(): Promise<AiInstruction[]> {
    return this.aiInstructionsService.findAll();
  }

  @Get('pending/:elderId')
  async getPendingInstructions(
    @Param('elderId') elderId: string,
  ): Promise<AiInstruction[]> {
    return this.aiInstructionsService.getPendingInstructions(elderId as any);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AiInstruction> {
    return this.aiInstructionsService.findOne(id);
  }

  @Put('apply')
  async markAsApplied(
    @Body() applyDto: { instructionIds: string[]; callId: string },
  ): Promise<void> {
    return this.aiInstructionsService.markInstructionsAsApplied(
      applyDto.instructionIds as any[],
      applyDto.callId as any,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAiInstructionDto: Partial<AiInstruction>,
  ): Promise<AiInstruction> {
    return this.aiInstructionsService.update(id, updateAiInstructionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.aiInstructionsService.remove(id);
  }
}
