import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MoodsService } from './moods.service';
import { Mood } from './moods.schema';

@Controller('moods')
export class MoodsController {
  constructor(private readonly moodsService: MoodsService) {}

  @Post()
  async create(@Body() createMoodDto: Partial<Mood>): Promise<Mood> {
    return this.moodsService.create(createMoodDto);
  }

  @Get()
  async findAll(): Promise<Mood[]> {
    return this.moodsService.findAll();
  }

  @Get('elder/:elderId')
  async findByElder(@Param('elderId') elderId: string): Promise<Mood[]> {
    return this.moodsService.findByElder(elderId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Mood> {
    return this.moodsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMoodDto: Partial<Mood>): Promise<Mood> {
    return this.moodsService.update(id, updateMoodDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.moodsService.remove(id);
  }
}