import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Profile } from './schema/profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private ProfileModel: mongoose.Model<Profile>,
  ) {}

  async createProfile(profile: Profile): Promise<Profile> {
    return this.ProfileModel.create(profile);
  }

  async findByCreatorId(_id: Types.ObjectId): Promise<Profile> {
    const Profile = await this.ProfileModel.findOne({
      creatorId: _id,
    }).populate('creatorId', 'is_company_active');

    if (!Profile) {
      throw new NotFoundException('Profile Not Found');
    }

    return Profile;
  }

  async findById(_id: Types.ObjectId): Promise<Profile> {
    const Profile = await this.ProfileModel.findById(_id);
    if (!Profile) {
      throw new NotFoundException('Profile Not Found');
    }
    return Profile;
  }

  async updateById(_id: Types.ObjectId, Profile: Profile): Promise<Profile> {
    return await this.ProfileModel.findByIdAndUpdate(_id, Profile, {
      new: true,
      runValidators: true,
    });
  }
}
