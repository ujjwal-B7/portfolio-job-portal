// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schema/profile.schema';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

import { UploadModule } from 'src/uploadFile/uploadFile.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    UploadModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
