import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ElderUserDocument = ElderUser & Document;

@Schema({ _id: false })
export class PhoneNumber {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  number: string;
}

@Schema({ _id: false })
export class EmergencyContact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  relation: string;

  @Prop({ required: true })
  phoneNumber: string;
}

@Schema({ _id: false })
export class MedicalInfo {
  @Prop({ type: [String], default: [] })
  conditions: string[];

  @Prop({ type: [String], default: [] })
  medications: string[];

  @Prop({ type: [String], default: [] })
  allergies: string[];
}

@Schema({ timestamps: true })
export class ElderUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({
    type: [PhoneNumber],
    required: true,
    validate: [
      (val: PhoneNumber[]) => val.length > 0,
      'At least one phone number is required',
    ],
  })
  phoneNumbers: PhoneNumber[];

  @Prop({ type: [EmergencyContact], default: [] })
  emergencyContacts: EmergencyContact[];

  @Prop({
    type: MedicalInfo,
    default: () => ({ conditions: [], medications: [], allergies: [] }),
  })
  medicalInfo: MedicalInfo;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  caregivers: Types.ObjectId[];
}

export const ElderUserSchema = SchemaFactory.createForClass(ElderUser);

// Indexes for efficient queries
ElderUserSchema.index({ 'phoneNumbers.number': 1 });
ElderUserSchema.index({ caregivers: 1 });
