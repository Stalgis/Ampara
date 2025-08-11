import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AiInstructionsService } from './ai-instructions.service';
import { CreateAiInstructionDto } from './dto/create-ai-instruction.dto';
import { UpdateAiInstructionDto } from './dto/update-ai-instruction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.schema';

@Controller('ai-instructions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiInstructionsController {
  constructor(private readonly aiInstructionsService: AiInstructionsService) {}

  @Post()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  create(@Body() createAiInstructionDto: CreateAiInstructionDto) {
    return this.aiInstructionsService.create(createAiInstructionDto);
  }

  @Get()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findAll() {
    return this.aiInstructionsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findOne(@Param('id') id: string) {
    return this.aiInstructionsService.findOne(id);
  }

  @Get('elder/:elderId')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findByElderId(@Param('elderId') elderId: string) {
    return this.aiInstructionsService.findByElderId(elderId);
  }

  @Patch(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  update(
    @Param('id') id: string,
    @Body() updateAiInstructionDto: UpdateAiInstructionDto,
  ) {
    return this.aiInstructionsService.update(id, updateAiInstructionDto);
  }

  @Delete(':id')
  @Roles(UserRole.NURSE)
  remove(@Param('id') id: string) {
    return this.aiInstructionsService.remove(id);
  }
}
