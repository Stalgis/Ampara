import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoodsController } from './moods.controller';
import { MoodsService } from './moods.service';
import { Mood, MoodSchema } from './mood.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mood.name, schema: MoodSchema }]),
  ],
  controllers: [MoodsController],
  providers: [MoodsService],
  exports: [MoodsService],
})
export class MoodsModule {}
