import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('linkedElders').exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).populate('linkedElders').exec();
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).populate('linkedElders').exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
