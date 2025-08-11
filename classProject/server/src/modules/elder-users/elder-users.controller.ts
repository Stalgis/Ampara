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
import { ElderUsersService } from './elder-users.service';
import { CreateElderUserDto } from './dto/create-elder-user.dto';
import { UpdateElderUserDto } from './dto/update-elder-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.schema';

@Controller('elder-users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ElderUsersController {
  constructor(private readonly elderUsersService: ElderUsersService) {}

  @Post()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  create(@Body() createElderUserDto: CreateElderUserDto) {
    return this.elderUsersService.create(createElderUserDto);
  }

  @Get()
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findAll() {
    return this.elderUsersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  findOne(@Param('id') id: string) {
    return this.elderUsersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.FAMILY_MEMBER, UserRole.NURSE)
  update(
    @Param('id') id: string,
    @Body() updateElderUserDto: UpdateElderUserDto,
  ) {
    return this.elderUsersService.update(id, updateElderUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.NURSE)
  remove(@Param('id') id: string) {
    return this.elderUsersService.remove(id);
  }
}
