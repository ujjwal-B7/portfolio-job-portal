import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Role {
  @Prop()
  role: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;
}
export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ role: 1, creatorId: 1 });
