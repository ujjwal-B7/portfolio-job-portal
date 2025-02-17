import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateDomainDto {
  @IsNotEmpty()
  readonly domain: string;
  @IsNotEmpty()
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
