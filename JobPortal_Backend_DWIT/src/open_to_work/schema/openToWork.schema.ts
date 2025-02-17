import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class OpenToWork {
  @Prop()
  job_title: string;

  @Prop()
  employee_name: string;

  @Prop()
  email: string;

  @Prop()
  contact_number: string;

  @Prop()
  salary: string;

  @Prop()
  skills_array: string[];

  @Prop()
  experience: string;

  @Prop()
  degree: string;

  @Prop({ default: false })
  is_responded: boolean;
}
export const OpenToWorkSchema = SchemaFactory.createForClass(OpenToWork);
