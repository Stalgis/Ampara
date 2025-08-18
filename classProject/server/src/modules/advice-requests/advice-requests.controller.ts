import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdviceRequestsService } from './advice-requests.service';
import { AdviceRequest } from './advice-requests.schema';

@Controller('advice-requests')
export class AdviceRequestsController {
  constructor(private readonly adviceRequestsService: AdviceRequestsService) {}

  @Post()
  async create(@Body() createAdviceRequestDto: Partial<AdviceRequest>): Promise<AdviceRequest> {
    return this.adviceRequestsService.create(createAdviceRequestDto);
  }

  @Get()
  async findAll(): Promise<AdviceRequest[]> {
    return this.adviceRequestsService.findAll();
  }

  @Get('elder/:elderId')
  async findByElder(@Param('elderId') elderId: string): Promise<AdviceRequest[]> {
    return this.adviceRequestsService.findByElder(elderId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdviceRequest> {
    return this.adviceRequestsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAdviceRequestDto: Partial<AdviceRequest>): Promise<AdviceRequest> {
    return this.adviceRequestsService.update(id, updateAdviceRequestDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.adviceRequestsService.remove(id);
  }
}