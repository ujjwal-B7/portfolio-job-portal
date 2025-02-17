// job/dto/create-job.dto.ts

import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateTitleDto {
  @IsNotEmpty()
  readonly title: string;
  @IsNotEmpty()
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
