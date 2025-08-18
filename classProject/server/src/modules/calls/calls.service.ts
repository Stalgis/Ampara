import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call, CallDocument } from './calls.schema';

@Injectable()
export class CallsService {
  constructor(
    @InjectModel(Call.name) private callModel: Model<CallDocument>,
  ) {}

  async create(createCallDto: Partial<Call>): Promise<Call> {
    const createdCall = new this.callModel(createCallDto);
    return createdCall.save();
  }

  async findAll(): Promise<Call[]> {
    return this.callModel.find().populate(['elderId', 'instructions']).exec();
  }

  async findByElder(elderId: string): Promise<Call[]> {
    return this.callModel.find({ elderId }).populate(['elderId', 'instructions']).sort({ calledAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Call> {
    return this.callModel.findById(id).populate(['elderId', 'instructions']).exec();
  }

  async update(id: string, updateCallDto: Partial<Call>): Promise<Call> {
    return this.callModel.findByIdAndUpdate(id, updateCallDto, { new: true }).populate(['elderId', 'instructions']).exec();
  }

  async remove(id: string): Promise<void> {
    await this.callModel.findByIdAndDelete(id).exec();
  }
}