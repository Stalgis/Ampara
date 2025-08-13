import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call, CallDocument } from './call.schema';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallsService {
  constructor(@InjectModel(Call.name) private callModel: Model<CallDocument>) {}

  async create(createCallDto: CreateCallDto): Promise<Call> {
    const createdCall = new this.callModel(createCallDto);
    return createdCall.save();
  }

  async findAll(): Promise<Call[]> {
    return this.callModel.find().exec();
  }

  async findOne(id: string): Promise<Call | null> {
    return this.callModel.findById(id).exec();
  }

  async findByElderId(elderId: string): Promise<Call[]> {
    return this.callModel.find({ elderId }).sort({ calledAt: -1 }).exec();
  }

  async update(id: string, updateCallDto: UpdateCallDto): Promise<Call | null> {
    return this.callModel
      .findByIdAndUpdate(id, updateCallDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Call | null> {
    return this.callModel.findByIdAndDelete(id).exec();
  }
}
