import {
  BadRequestException,
  Bind,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './schema/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/authentication/auth.guard';

import { FormDataBody } from '../company/form-data-body.decorator';

import { unlink } from 'fs';
import { promisify } from 'util';

import { ObjectId, Types } from 'mongoose';
import { imageUploadOptions } from 'src/utils/FileUpload';

const unlinkAsync = promisify(unlink);

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor(
      'image',
      imageUploadOptions('./images/profile-images/company'),
    ),
  )
  async createProfile(
    @FormDataBody()
    profile: CreateProfileDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request: { user: { userId: ObjectId; role: string } },
  ): Promise<Profile> {
    const id = request.user.userId;
    const role = request.user.role;

    if (!image) {
      throw new BadRequestException('Profile image file is required');
    }

    const filePath = `images/profile-images/company/${image.filename}`;

    return this.profileService.createProfile({
      ...profile,
      logo: filePath,
      creatorId: id,
    });
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor(
      'image',
      imageUploadOptions('./images/profile-images/company'),
    ),
  )
  async updateProfile(
    @Param('id')
    id: string,
    @FormDataBody()
    profile: UpdateProfileDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Profile> {
    const _id = new Types.ObjectId(id);
    // Fetch the current company data
    const currentProfile = await this.profileService.findById(_id);

    let filePath = currentProfile.logo;

    if (image) {
      filePath = `images/profile-images/company/${image.filename}`;

      console.log('new logo', filePath);

      // Delete the old image file if it exists
      if (currentProfile.logo) {
        try {
          await unlinkAsync(currentProfile.logo);
          console.log('deleting logo', currentProfile.logo);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    }

    // const filePath = `images/${image.filename}`;

    return this.profileService.updateById(_id, { ...profile, logo: filePath });
  }

  @UseGuards(AuthGuard)
  @Post('/users')
  @UseInterceptors(
    FileInterceptor(
      'profile_picture',
      imageUploadOptions('./images/profile-images/users'),
    ),
  )
  async createProfileByUser(
    @FormDataBody()
    profile: CreateProfileDto,
    @UploadedFile() profile_picture: Express.Multer.File,
    @Req() request: { user: { userId: ObjectId } },
  ): Promise<Profile> {
    const id = request.user.userId;

    // if (!profile_picture) {
    //   throw new BadRequestException('Profile image file is required');
    // }
    let filePath: string;
    if (!profile_picture) {
      filePath = '';
    } else {
      filePath = `images/profile-images/users/${profile_picture?.filename}`;
    }

    return this.profileService.createProfile({
      ...profile,
      logo: filePath,
      creatorId: id,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/users/:id')
  @UseInterceptors(
    FileInterceptor(
      'profile_picture',
      imageUploadOptions('./images/profile-images/users'),
    ),
  )
  async updateProfileByUser(
    @Param('id')
    id: string,
    @FormDataBody()
    profile: UpdateProfileDto,
    @UploadedFile() profile_picture: Express.Multer.File,
  ): Promise<Profile> {
    console.log('profile', profile);
    console.log('profile_picture', profile_picture);

    const _id = new Types.ObjectId(id);

    // Fetch the current company data
    const currentProfile = await this.profileService.findById(_id);

    let filePath = currentProfile.logo;

    console.log('old logo', filePath);

    if (profile_picture) {
      filePath = `images/profile-images/users/${profile_picture.filename}`;

      console.log('new logo', filePath);

      // Delete the old image file if it exists
      if (currentProfile.logo) {
        try {
          await unlinkAsync(currentProfile.logo);
          console.log('deleting logo', currentProfile.logo);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    }

    // const filePath = `images/${image.filename}`;

    return this.profileService.updateById(_id, { ...profile, logo: filePath });
  }

  @UseGuards(AuthGuard)
  @Get('/creator/:id')
  async getProfileByCreator(
    @Param('id')
    id: string,
  ): Promise<Profile> {
    const _id = new Types.ObjectId(id);

    return this.profileService.findByCreatorId(_id);
  }

  @Get(':id')
  async getProfile(
    @Param('id')
    id: string,
  ): Promise<Profile> {
    const _id = new Types.ObjectId(id);
    return this.profileService.findById(_id);
  }
}
