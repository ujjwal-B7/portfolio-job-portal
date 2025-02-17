import mongoose from 'mongoose';

export class CreateJobDto {
  readonly title: string;
  readonly technology: string;
  readonly salary: string;
  readonly experience: string;
  readonly location: string;
  readonly role: string;
  readonly domain: string;
  readonly type: string;
  readonly description: string;
  readonly qualification: string;
  readonly applicationStart: Date;
  readonly applicationDeadline: Date;
  readonly creatorId: mongoose.Schema.Types.ObjectId;
  readonly companyId: mongoose.Schema.Types.ObjectId;
  readonly profileId: mongoose.Schema.Types.ObjectId;
}
