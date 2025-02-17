// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenToWork, OpenToWorkSchema } from './schema/openToWork.schema';
import { OpenToWorkController } from './openToWork.controller';
import { OpenToWorkService } from './openToWork.service';

import { UploadModule } from 'src/uploadFile/uploadFile.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OpenToWork.name, schema: OpenToWorkSchema },
    ]),
    UploadModule,
  ],
  controllers: [OpenToWorkController],
  providers: [OpenToWorkService],
})
export class OpenToWorkModule {}
