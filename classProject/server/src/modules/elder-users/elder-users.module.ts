import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ElderUsersController } from './elder-users.controller';
import { ElderUsersService } from './elder-users.service';
import { ElderUser, ElderUserSchema } from './elder-users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ElderUser.name, schema: ElderUserSchema }]),
  ],
  controllers: [ElderUsersController],
  providers: [ElderUsersService],
  exports: [ElderUsersService],
})
export class ElderUsersModule {}