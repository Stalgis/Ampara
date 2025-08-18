import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MoodDocument = Mood & Document;

@Schema({ timestamps: true })
export class Mood {
  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ enum: ['AUTO', 'MANUAL'], required: true })
  source: string;

  @Prop({ required: true })
  mood: string;

  @Prop({ min: 0, max: 1 })
  confidence: number;

  @Prop({ required: true })
  timestamp: Date;
}

export const MoodSchema = SchemaFactory.createForClass(Mood);