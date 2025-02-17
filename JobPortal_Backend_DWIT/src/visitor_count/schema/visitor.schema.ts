import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Visitor extends Document {
  @Prop()
  count: number;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
