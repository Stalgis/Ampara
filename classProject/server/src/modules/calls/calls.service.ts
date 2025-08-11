import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string): Promise<Call> {
    const call = await this.callModel.findById(id).exec();
    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }
    return call;
  }

  async findByElderId(elderId: string): Promise<Call[]> {
    return this.callModel.find({ elderId }).sort({ calledAt: -1 }).exec();
  }

  async update(id: string, updateCallDto: UpdateCallDto): Promise<Call> {
    const updatedCall = await this.callModel
      .findByIdAndUpdate(id, updateCallDto, { new: true })
      .exec();
    if (!updatedCall) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }
    return updatedCall;
  }

  async remove(id: string): Promise<Call> {
    const deletedCall = await this.callModel.findByIdAndDelete(id).exec();
    if (!deletedCall) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }
    return deletedCall;
  }
}
