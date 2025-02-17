import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Type {
  @Prop()
  types: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;
}
export const TypeSchema = SchemaFactory.createForClass(Type);

TypeSchema.index({ type: 1, creatorId: 1 });
