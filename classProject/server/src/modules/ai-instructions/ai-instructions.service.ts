import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiInstruction, AiInstructionDocument } from './ai-instructions.schema';

@Injectable()
export class AiInstructionsService {
  constructor(
    @InjectModel(AiInstruction.name)
    private aiInstructionModel: Model<AiInstructionDocument>,
  ) {}

  async getPendingInstructions(
    elderId: Types.ObjectId,
  ): Promise<AiInstruction[]> {
    return this.aiInstructionModel
      .find({ elderId, status: 'PENDING' })
      .sort({ createdAt: 1 })
      .exec();
  }

  async markInstructionsAsApplied(
    instructionIds: Types.ObjectId[],
    callId: Types.ObjectId,
  ): Promise<void> {
    await this.aiInstructionModel
      .updateMany(
        { _id: { $in: instructionIds } },
        {
          $set: {
            status: 'APPLIED',
            appliedAt: new Date(),
            callId,
          },
        },
      )
      .exec();
  }

  async createInstruction(
    elderId: Types.ObjectId,
    createdBy: Types.ObjectId,
    message: string,
    aiResponse?: string,
  ): Promise<AiInstruction> {
    const instruction = new this.aiInstructionModel({
      elderId,
      createdBy,
      message,
      aiResponse,
      status: 'PENDING',
    });
    return instruction.save();
  }

  async findAll(): Promise<AiInstruction[]> {
    return this.aiInstructionModel
      .find()
      .populate(['elderId', 'createdBy', 'callId'])
      .exec();
  }

  async findOne(id: string): Promise<AiInstruction | null> {
    return this.aiInstructionModel
      .findById(id)
      .populate(['elderId', 'createdBy', 'callId'])
      .exec();
  }

  async update(
    id: string,
    updateAiInstructionDto: Partial<AiInstruction>,
  ): Promise<AiInstruction | null> {
    return this.aiInstructionModel
      .findByIdAndUpdate(id, updateAiInstructionDto, { new: true })
      .populate(['elderId', 'createdBy', 'callId'])
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.aiInstructionModel.findByIdAndDelete(id).exec();
  }
}
