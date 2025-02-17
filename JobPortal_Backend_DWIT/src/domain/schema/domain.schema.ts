import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/authentication/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Domain {
  @Prop()
  domain: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;
}

export const DomainSchema = SchemaFactory.createForClass(Domain);

DomainSchema.index({ domain: 1, creatorId: 1 });
