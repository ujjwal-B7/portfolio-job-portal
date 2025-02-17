import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './uploadFile.service';

@Controller('user')
export class UserController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('uploadfile')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() image: Express.Multer.File) {
    const filePath = await this.uploadService.uploadFile(image);
    return { filePath };
  }
}
