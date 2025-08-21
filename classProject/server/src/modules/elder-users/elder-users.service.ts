import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ElderUser, ElderUserDocument } from './elder-users.schema';

@Injectable()
export class ElderUsersService {
  constructor(
    @InjectModel(ElderUser.name) private elderUserModel: Model<ElderUserDocument>,
  ) {}

  async create(createElderUserDto: Partial<ElderUser>): Promise<ElderUser> {
    const createdElderUser = new this.elderUserModel(createElderUserDto);
    return createdElderUser.save();
  }

  async findAll(): Promise<ElderUser[]> {
    return this.elderUserModel.find().populate('caregivers').exec();
  }

  async findOne(id: string): Promise<ElderUser | null> {
    return this.elderUserModel
      .findById(id)
      .populate('caregivers')
      .exec();
  }

  async update(
    id: string,
    updateElderUserDto: Partial<ElderUser>,
  ): Promise<ElderUser | null> {
    return this.elderUserModel
      .findByIdAndUpdate(id, updateElderUserDto, { new: true })
      .populate('caregivers')
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.elderUserModel.findByIdAndDelete(id).exec();
  }
}