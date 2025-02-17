// job/dto/create-job.dto.ts

import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateTechnologyDto {
  @IsNotEmpty()
  readonly technology: string;
  @IsNotEmpty()
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
