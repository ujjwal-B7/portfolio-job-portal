import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from 'src/authentication/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Title {
  @Prop()
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;
}
export const TitleSchema = SchemaFactory.createForClass(Title);

TitleSchema.index({ title: 1, creatorId: 1 });
