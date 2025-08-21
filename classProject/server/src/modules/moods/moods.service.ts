import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mood, MoodDocument } from './moods.schema';

@Injectable()
export class MoodsService {
  constructor(
    @InjectModel(Mood.name) private moodModel: Model<MoodDocument>,
  ) {}

  async create(createMoodDto: Partial<Mood>): Promise<Mood> {
    const createdMood = new this.moodModel(createMoodDto);
    return createdMood.save();
  }

  async findAll(): Promise<Mood[]> {
    return this.moodModel.find().populate('elderId').exec();
  }

  async findByElder(elderId: string): Promise<Mood[]> {
    return this.moodModel.find({ elderId }).populate('elderId').sort({ timestamp: -1 }).exec();
  }

  async findOne(id: string): Promise<Mood | null> {
    return this.moodModel.findById(id).populate('elderId').exec();
  }

  async update(
    id: string,
    updateMoodDto: Partial<Mood>,
  ): Promise<Mood | null> {
    return this.moodModel
      .findByIdAndUpdate(id, updateMoodDto, { new: true })
      .populate('elderId')
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.moodModel.findByIdAndDelete(id).exec();
  }
}