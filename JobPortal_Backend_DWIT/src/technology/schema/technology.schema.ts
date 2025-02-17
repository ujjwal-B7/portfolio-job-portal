import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Technology {
  @Prop()
  technology: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;
}
export const TechnologySchema = SchemaFactory.createForClass(Technology);

TechnologySchema.index({ technology: 1, creatorId: 1 });
