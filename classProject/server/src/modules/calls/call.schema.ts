import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CallDocument = Call & Document;

export enum CallStatus {
  COMPLETED = 'completed',
  NO_ANSWER = 'no-answer',
  BUSY = 'busy',
  FAILED = 'failed',
  IN_PROGRESS = 'in-progress',
}

@Schema({ timestamps: true })
export class Call {
  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ required: true })
  dialedNumber: string;

  @Prop({ required: true })
  providerCallSid: string;

  @Prop({ required: true, enum: CallStatus })
  callStatus: CallStatus;

  @Prop({ required: true })
  callDuration: number; // in seconds

  @Prop()
  recordingUrl?: string;

  @Prop({ required: true })
  transcript: string;

  @Prop({ required: true })
  gptSummary: string;

  @Prop({ required: true })
  moodAnalysis: string;

  @Prop({ type: [Types.ObjectId], ref: 'AiInstruction', default: [] })
  instructions: Types.ObjectId[];

  @Prop({ required: true })
  calledAt: Date;
}

export const CallSchema = SchemaFactory.createForClass(Call);

// Indexes for efficient queries
CallSchema.index({ elderId: 1, calledAt: -1 });
CallSchema.index({ dialedNumber: 1 });
