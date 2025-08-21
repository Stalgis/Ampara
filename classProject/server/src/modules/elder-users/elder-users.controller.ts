import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ElderUsersService } from './elder-users.service';
import { ElderUser } from './elder-users.schema';

@Controller('elder-users')
export class ElderUsersController {
  constructor(private readonly elderUsersService: ElderUsersService) {}

  @Post()
  async create(@Body() createElderUserDto: Partial<ElderUser>): Promise<ElderUser> {
    return this.elderUsersService.create(createElderUserDto);
  }

  @Get()
  async findAll(): Promise<ElderUser[]> {
    return this.elderUsersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ElderUser | null> {
    return this.elderUsersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateElderUserDto: Partial<ElderUser>,
  ): Promise<ElderUser | null> {
    return this.elderUsersService.update(id, updateElderUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.elderUsersService.remove(id);
  }
}