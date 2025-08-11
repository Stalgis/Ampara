import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mood, MoodDocument } from './mood.schema';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';

@Injectable()
export class MoodsService {
  constructor(@InjectModel(Mood.name) private moodModel: Model<MoodDocument>) {}

  async create(createMoodDto: CreateMoodDto): Promise<Mood> {
    const createdMood = new this.moodModel(createMoodDto);
    return createdMood.save();
  }

  async findAll(): Promise<Mood[]> {
    return this.moodModel.find().exec();
  }

  async findOne(id: string): Promise<Mood> {
    const mood = await this.moodModel.findById(id).exec();
    if (!mood) {
      throw new NotFoundException(`Mood with id ${id} not found`);
    }
    return mood;
  }

  async findByElderId(elderId: string): Promise<Mood[]> {
    return this.moodModel.find({ elderId }).sort({ timestamp: -1 }).exec();
  }

  async update(id: string, updateMoodDto: UpdateMoodDto): Promise<Mood> {
    const updatedMood = await this.moodModel
      .findByIdAndUpdate(id, updateMoodDto, { new: true })
      .exec();
    if (!updatedMood) {
      throw new NotFoundException(`Mood with id ${id} not found`);
    }
    return updatedMood;
  }

  async remove(id: string): Promise<Mood> {
    const deletedMood = await this.moodModel.findByIdAndDelete(id).exec();
    if (!deletedMood) {
      throw new NotFoundException(`Mood with id ${id} not found`);
    }
    return deletedMood;
  }
}
