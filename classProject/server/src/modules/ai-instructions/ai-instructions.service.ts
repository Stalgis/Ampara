import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiInstruction, AiInstructionDocument } from './ai-instruction.schema';
import { CreateAiInstructionDto } from './dto/create-ai-instruction.dto';
import { UpdateAiInstructionDto } from './dto/update-ai-instruction.dto';

@Injectable()
export class AiInstructionsService {
  constructor(
    @InjectModel(AiInstruction.name)
    private aiInstructionModel: Model<AiInstructionDocument>,
  ) {}

  async create(
    createAiInstructionDto: CreateAiInstructionDto,
  ): Promise<AiInstruction> {
    const created = new this.aiInstructionModel(createAiInstructionDto);
    return created.save();
  }

  async findAll(): Promise<AiInstruction[]> {
    return this.aiInstructionModel.find().exec();
  }

  async findOne(id: string): Promise<AiInstruction | null> {
    return this.aiInstructionModel.findById(id).exec();
  }

  async findByElderId(elderId: string): Promise<AiInstruction[]> {
    return this.aiInstructionModel
      .find({ elderId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateAiInstructionDto: UpdateAiInstructionDto,
  ): Promise<AiInstruction | null> {
    return this.aiInstructionModel
      .findByIdAndUpdate(id, updateAiInstructionDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<AiInstruction | null> {
    return this.aiInstructionModel.findByIdAndDelete(id).exec();
  }
}
