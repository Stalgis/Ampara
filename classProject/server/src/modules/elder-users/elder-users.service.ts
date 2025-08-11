import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ElderUser, ElderUserDocument } from './elder-user.schema';
import { CreateElderUserDto } from './dto/create-elder-user.dto';
import { UpdateElderUserDto } from './dto/update-elder-user.dto';

@Injectable()
export class ElderUsersService {
  constructor(
    @InjectModel(ElderUser.name)
    private elderUserModel: Model<ElderUserDocument>,
  ) {}

  async create(createElderUserDto: CreateElderUserDto): Promise<ElderUser> {
    const createdElderUser = new this.elderUserModel(createElderUserDto);
    return createdElderUser.save();
  }

  async findAll(): Promise<ElderUser[]> {
    return this.elderUserModel.find().exec();
  }

  async findOne(id: string): Promise<ElderUser | null> {
    return this.elderUserModel.findById(id).exec();
  }

  async update(
    id: string,
    updateElderUserDto: UpdateElderUserDto,
  ): Promise<ElderUser | null> {
    return this.elderUserModel
      .findByIdAndUpdate(id, updateElderUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ElderUser | null> {
    return this.elderUserModel.findByIdAndDelete(id).exec();
  }
}
