import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './uploadFile.service';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: join(__dirname, '..', '..', 'company_logos'),
    }),
  ],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
