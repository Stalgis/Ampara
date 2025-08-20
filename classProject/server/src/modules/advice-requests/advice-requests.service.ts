import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdviceRequest, AdviceRequestDocument } from './advice-requests.schema';

@Injectable()
export class AdviceRequestsService {
  constructor(
    @InjectModel(AdviceRequest.name) private adviceRequestModel: Model<AdviceRequestDocument>,
  ) {}

  async create(createAdviceRequestDto: Partial<AdviceRequest>): Promise<AdviceRequest> {
    const createdAdviceRequest = new this.adviceRequestModel(createAdviceRequestDto);
    return createdAdviceRequest.save();
  }

  async findAll(): Promise<AdviceRequest[]> {
    return this.adviceRequestModel.find().populate(['elderId', 'visitorId']).exec();
  }

  async findByElder(elderId: string): Promise<AdviceRequest[]> {
    return this.adviceRequestModel.find({ elderId }).populate(['elderId', 'visitorId']).sort({ askedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<AdviceRequest> {
    return this.adviceRequestModel.findById(id).populate(['elderId', 'visitorId']).exec();
  }

  async update(id: string, updateAdviceRequestDto: Partial<AdviceRequest>): Promise<AdviceRequest> {
    return this.adviceRequestModel.findByIdAndUpdate(id, updateAdviceRequestDto, { new: true }).populate(['elderId', 'visitorId']).exec();
  }

  async remove(id: string): Promise<void> {
    await this.adviceRequestModel.findByIdAndDelete(id).exec();
  }
}