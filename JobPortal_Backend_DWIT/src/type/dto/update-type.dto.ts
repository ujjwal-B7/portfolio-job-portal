import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateTypeDto {
  @IsNotEmpty()
  readonly types: string;
  @IsNotEmpty()
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
