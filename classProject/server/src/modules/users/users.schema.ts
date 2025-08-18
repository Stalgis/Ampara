import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class PhoneNumber {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  number: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ 
    required: true, 
    enum: ['FAMILY_MEMBER', 'NURSE', 'VISITOR'],
    default: 'FAMILY_MEMBER'
  })
  role: string;

  @Prop({ type: [PhoneNumber], default: [] })
  phoneNumbers: PhoneNumber[];

  @Prop({ type: [Types.ObjectId], ref: 'ElderUser', default: [] })
  linkedElders: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
