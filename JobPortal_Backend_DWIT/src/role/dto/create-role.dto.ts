import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty()
  readonly role: string;

  @IsNotEmpty()
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
