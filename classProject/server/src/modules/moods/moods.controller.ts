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
import { MoodsService } from './moods.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.schema';

@Controller('moods')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MoodsController {
  constructor(private readonly moodsService: MoodsService) {}

  @Post()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  create(@Body() createMoodDto: CreateMoodDto) {
    return this.moodsService.create(createMoodDto);
  }

  @Get()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findAll() {
    return this.moodsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findOne(@Param('id') id: string) {
    return this.moodsService.findOne(id);
  }

  @Get('elder/:elderId')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findByElderId(@Param('elderId') elderId: string) {
    return this.moodsService.findByElderId(elderId);
  }

  @Patch(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  update(@Param('id') id: string, @Body() updateMoodDto: UpdateMoodDto) {
    return this.moodsService.update(id, updateMoodDto);
  }

  @Delete(':id')
  @Roles(UserRole.NURSE)
  remove(@Param('id') id: string) {
    return this.moodsService.remove(id);
  }
}
