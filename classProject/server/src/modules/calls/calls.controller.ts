import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CallsService } from './calls.service';
import { Call } from './calls.schema';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  async create(@Body() createCallDto: Partial<Call>): Promise<Call> {
    return this.callsService.create(createCallDto);
  }

  @Get()
  async findAll(): Promise<Call[]> {
    return this.callsService.findAll();
  }

  @Get('elder/:elderId')
  async findByElder(@Param('elderId') elderId: string): Promise<Call[]> {
    return this.callsService.findByElder(elderId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Call | null> {
    return this.callsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCallDto: Partial<Call>,
  ): Promise<Call | null> {
    return this.callsService.update(id, updateCallDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.callsService.remove(id);
  }
}