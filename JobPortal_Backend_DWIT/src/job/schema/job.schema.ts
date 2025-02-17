import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({
  timestamps: true,
})
export class Job {
  @Prop()
  title: string;

  @Prop()
  technology: string;

  @Prop()
  salary: string;

  @Prop()
  experience: string;

  @Prop()
  location: string;

  @Prop()
  role: string;

  @Prop()
  domain: string;

  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  qualification: string;

  @Prop({ type: Date })
  applicationStart: Date;

  @Prop({ type: Date, index: true })
  applicationDeadline: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;

  // company id for admin to populate the company details since they have manually entered the company
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true,
  })
  companyId: mongoose.Schema.Types.ObjectId;

  // profile id for company to populate the company details since company has its profile
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    index: true,
  })
  profileId: mongoose.Schema.Types.ObjectId;
}
export const JobSchema = SchemaFactory.createForClass(Job);

// Create a text index on relevant fields with appropriate weights
JobSchema.index(
  {
    title: 'text',
    role: 'text',
    location: 'text',
    type: 'text',
    domain: 'text',
    description: 'text',
    technology: 'text',
  },
  {
    weights: {
      title: 5,
      technology: 5,
      domain: 4,
      role: 4,
      location: 2,
      description: 1,
    },
  },
);

JobSchema.index({ profileId: 1, companyId: 1 });
