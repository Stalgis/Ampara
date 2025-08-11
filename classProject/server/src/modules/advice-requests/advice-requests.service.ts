import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdviceRequest, AdviceRequestDocument } from './advice-request.schema';
import { CreateAdviceRequestDto } from './dto/create-advice-request.dto';
import { UpdateAdviceRequestDto } from './dto/update-advice-request.dto';

@Injectable()
export class AdviceRequestsService {
  constructor(
    @InjectModel(AdviceRequest.name)
    private adviceRequestModel: Model<AdviceRequestDocument>,
  ) {}

  async create(
    createAdviceRequestDto: CreateAdviceRequestDto,
  ): Promise<AdviceRequest> {
    const createdAdviceRequest = new this.adviceRequestModel(
      createAdviceRequestDto,
    );
    return createdAdviceRequest.save();
  }

  async findAll(): Promise<AdviceRequest[]> {
    return this.adviceRequestModel.find().exec();
  }

  async findOne(id: string): Promise<AdviceRequest | null> {
    return this.adviceRequestModel.findById(id).exec();
  }

  async findByElderId(elderId: string): Promise<AdviceRequest[]> {
    return this.adviceRequestModel
      .find({ elderId })
      .sort({ askedAt: -1 })
      .exec();
  }

  async findByVisitorId(visitorId: string): Promise<AdviceRequest[]> {
    return this.adviceRequestModel
      .find({ visitorId })
      .sort({ askedAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateAdviceRequestDto: UpdateAdviceRequestDto,
  ): Promise<AdviceRequest | null> {
    return this.adviceRequestModel
      .findByIdAndUpdate(id, updateAdviceRequestDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<AdviceRequest | null> {
    return this.adviceRequestModel.findByIdAndDelete(id).exec();
  }
}
