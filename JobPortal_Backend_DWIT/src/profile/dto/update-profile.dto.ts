import mongoose from 'mongoose';

export class UpdateProfileDto {
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
