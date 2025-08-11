import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AiInstructionDocument = AiInstruction & Document;

export enum AiInstructionStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
  SKIPPED = 'SKIPPED',
}

@Schema({ timestamps: true })
export class AiInstruction {
  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  aiResponse: string;

  @Prop({ required: true, enum: AiInstructionStatus })
  status: AiInstructionStatus;

  @Prop()
  appliedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Call' })
  callId?: Types.ObjectId;
}

export const AiInstructionSchema = SchemaFactory.createForClass(AiInstruction);

// Indexes for efficient queries
AiInstructionSchema.index({ elderId: 1, status: 1, createdAt: 1 });
AiInstructionSchema.index({ callId: 1 });
