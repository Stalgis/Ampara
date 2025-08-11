import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MoodDocument = Mood & Document;

export enum MoodSource {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

@Schema({ timestamps: true })
export class Mood {
  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ required: true, enum: MoodSource })
  source: MoodSource;

  @Prop({ required: true })
  mood: string;

  @Prop({ required: true, min: 0, max: 1 })
  confidence: number;

  @Prop({ required: true })
  timestamp: Date;
}

export const MoodSchema = SchemaFactory.createForClass(Mood);

// Indexes for efficient queries
MoodSchema.index({ elderId: 1, timestamp: -1 });
