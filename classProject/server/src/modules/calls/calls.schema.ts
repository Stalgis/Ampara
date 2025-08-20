import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CallDocument = Call & Document;

@Schema({ timestamps: true })
export class Call {
  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ required: true })
  dialedNumber: string;

  @Prop()
  providerCallSid: string;

  @Prop({ 
    enum: ['completed', 'no-answer', 'busy', 'failed', 'canceled'], 
    default: 'completed'
  })
  callStatus: string;

  @Prop({ default: 0 })
  callDuration: number;

  @Prop()
  recordingUrl: string;

  @Prop()
  transcript: string;

  @Prop()
  gptSummary: string;

  @Prop()
  moodAnalysis: string;

  @Prop({ type: [Types.ObjectId], ref: 'AiInstruction', default: [] })
  instructions: Types.ObjectId[];

  @Prop({ required: true })
  calledAt: Date;
}

export const CallSchema = SchemaFactory.createForClass(Call);