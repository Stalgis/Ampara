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
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.schema';

@Controller('calls')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  create(@Body() createCallDto: CreateCallDto) {
    return this.callsService.create(createCallDto);
  }

  @Get()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findAll() {
    return this.callsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findOne(@Param('id') id: string) {
    return this.callsService.findOne(id);
  }

  @Get('elder/:elderId')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findByElderId(@Param('elderId') elderId: string) {
    return this.callsService.findByElderId(elderId);
  }

  @Patch(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callsService.update(id, updateCallDto);
  }

  @Delete(':id')
  @Roles(UserRole.NURSE)
  remove(@Param('id') id: string) {
    return this.callsService.remove(id);
  }
}
