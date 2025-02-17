import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class JobApplication {
 
  @Prop()
  experience: string;

  @Prop()
  cv_pdf: string;

  @Prop()
  cover_letter_pdf: string;

  @Prop({ default: 'pending', index: true })
  application_status?: 'pending' | 'accepted' | 'rejected' | 'dispatched';

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  })
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  applicantId: mongoose.Schema.Types.ObjectId;
}
export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);
