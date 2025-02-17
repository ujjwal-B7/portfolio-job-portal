// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobApplication,
  JobApplicationSchema,
} from './schema/job_application.schema';
import { JobApplicationController } from './job_application.controller';
import { JobApplicationService } from './job_application.service';

import { UploadModule } from 'src/uploadFile/uploadFile.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema },
    ]),
    UploadModule,
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationModule {}
