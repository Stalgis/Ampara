import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string): Promise<AdviceRequest> {
    const adviceRequest = await this.adviceRequestModel.findById(id).exec();
    if (!adviceRequest) {
      throw new NotFoundException(`AdviceRequest with id ${id} not found`);
    }
    return adviceRequest;
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
  ): Promise<AdviceRequest> {
    const updatedAdviceRequest = await this.adviceRequestModel
      .findByIdAndUpdate(id, updateAdviceRequestDto, { new: true })
      .exec();
    if (!updatedAdviceRequest) {
      throw new NotFoundException(`AdviceRequest with id ${id} not found`);
    }
    return updatedAdviceRequest;
  }

  async remove(id: string): Promise<AdviceRequest> {
    const deletedAdviceRequest = await this.adviceRequestModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedAdviceRequest) {
      throw new NotFoundException(`AdviceRequest with id ${id} not found`);
    }
    return deletedAdviceRequest;
  }
}
