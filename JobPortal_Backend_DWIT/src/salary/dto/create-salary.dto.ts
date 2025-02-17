import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateSalaryDto {
  @IsNotEmpty()
  readonly salary: string;
  @IsNotEmpty()
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
