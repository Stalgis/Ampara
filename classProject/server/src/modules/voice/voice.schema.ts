import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VoiceCallDocument = VoiceCall & Document;

export enum CallStatus {
  INITIATED = 'INITIATED',
  RINGING = 'RINGING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  BUSY = 'BUSY',
  NO_ANSWER = 'NO_ANSWER',
}

export enum CallDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

@Schema({ timestamps: true })
export class VoiceCall {
  @Prop({ required: true, unique: true })
  callSid: string;

  @Prop({ type: Types.ObjectId, ref: 'ElderUser', required: true })
  elderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  initiatedBy?: Types.ObjectId;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, enum: CallDirection })
  direction: CallDirection;

  @Prop({ required: true, enum: CallStatus, default: CallStatus.INITIATED })
  status: CallStatus;

  @Prop()
  duration?: number; // in seconds

  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;

  @Prop()
  recording?: string; // URL to recording if available

  @Prop({ type: [Types.ObjectId], ref: 'ConversationTurn', default: [] })
  conversationTurns: Types.ObjectId[];

  @Prop({ type: Object })
  twilioData?: Record<string, any>; // Store additional Twilio metadata
}

export const VoiceCallSchema = SchemaFactory.createForClass(VoiceCall);

// Indexes for efficient queries
VoiceCallSchema.index({ elderId: 1, createdAt: -1 });
VoiceCallSchema.index({ callSid: 1 });
VoiceCallSchema.index({ status: 1 });

export type ConversationTurnDocument = ConversationTurn & Document;

export enum SpeakerType {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

@Schema({ timestamps: true })
export class ConversationTurn {
  @Prop({ type: Types.ObjectId, ref: 'VoiceCall', required: true })
  callId: Types.ObjectId;

  @Prop({ required: true, enum: SpeakerType })
  speaker: SpeakerType;

  @Prop()
  transcription?: string; // What was said (transcribed)

  @Prop()
  response?: string; // AI response text

  @Prop()
  audioUrl?: string; // URL to audio file if stored

  @Prop()
  confidence?: number; // Transcription confidence score

  @Prop()
  duration?: number; // Turn duration in milliseconds

  @Prop()
  aiModel?: string; // Which AI model was used (gpt-3.5-turbo, gpt-4, etc.)

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>; // Additional turn metadata
}

export const ConversationTurnSchema = SchemaFactory.createForClass(ConversationTurn);

// Indexes for efficient queries
ConversationTurnSchema.index({ callId: 1, createdAt: 1 });
ConversationTurnSchema.index({ speaker: 1 });