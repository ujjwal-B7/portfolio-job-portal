import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Salary {
  @Prop()
  salary: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;
}
export const SalarySchema = SchemaFactory.createForClass(Salary);

SalarySchema.index({ salary: 1, creatorId: 1 });
