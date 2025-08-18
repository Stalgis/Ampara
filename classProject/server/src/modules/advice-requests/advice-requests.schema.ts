import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdviceRequestDocument = AdviceRequest & Document;

@Schema({ timestamps: true })
export class AdviceRequest {
  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  visitorId: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop()
  response: string;

  @Prop({ required: true })
  askedAt: Date;

  @Prop()
  answeredAt: Date;
}

export const AdviceRequestSchema = SchemaFactory.createForClass(AdviceRequest);