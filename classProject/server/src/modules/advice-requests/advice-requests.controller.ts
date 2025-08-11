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
import { AdviceRequestsService } from './advice-requests.service';
import { CreateAdviceRequestDto } from './dto/create-advice-request.dto';
import { UpdateAdviceRequestDto } from './dto/update-advice-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.schema';

@Controller('advice-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdviceRequestsController {
  constructor(private readonly adviceRequestsService: AdviceRequestsService) {}

  @Post()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  create(@Body() createAdviceRequestDto: CreateAdviceRequestDto) {
    return this.adviceRequestsService.create(createAdviceRequestDto);
  }

  @Get()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findAll() {
    return this.adviceRequestsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findOne(@Param('id') id: string) {
    return this.adviceRequestsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  update(
    @Param('id') id: string,
    @Body() updateAdviceRequestDto: UpdateAdviceRequestDto,
  ) {
    return this.adviceRequestsService.update(id, updateAdviceRequestDto);
  }

  @Delete(':id')
  @Roles(UserRole.NURSE)
  remove(@Param('id') id: string) {
    return this.adviceRequestsService.remove(id);
  }
}
