import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTechnologyDto {
  @IsNotEmpty()
  readonly technology: string;

  @IsNotEmpty()
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
