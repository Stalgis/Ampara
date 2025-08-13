import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdviceRequestsService } from './advice-requests.service';
import { CreateAdviceRequestDto } from './dto/create-advice-request.dto';
import { UpdateAdviceRequestDto } from './dto/update-advice-request.dto';

@Controller('advice-requests')
export class AdviceRequestsController {
  constructor(private readonly adviceRequestsService: AdviceRequestsService) {}

  @Post()
  create(@Body() createAdviceRequestDto: CreateAdviceRequestDto) {
    return this.adviceRequestsService.create(createAdviceRequestDto);
  }

  @Get()
  findAll() {
    return this.adviceRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adviceRequestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdviceRequestDto: UpdateAdviceRequestDto,
  ) {
    return this.adviceRequestsService.update(id, updateAdviceRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adviceRequestsService.remove(id);
  }
}
