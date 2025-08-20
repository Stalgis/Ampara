import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AiInstructionDocument = AiInstruction & Document;

@Schema({ timestamps: true })
export class AiInstruction {
  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop()
  aiResponse: string;

  @Prop({
    enum: ['PENDING', 'APPLIED', 'SKIPPED'],
    default: 'PENDING',
  })
  status: string;

  @Prop()
  appliedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Call' })
  callId: Types.ObjectId;
}

export const AiInstructionSchema = SchemaFactory.createForClass(AiInstruction);
