import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OpenToWorkService } from './openToWork.service';
import { OpenToWork } from './schema/openToWork.schema';
import { OpenToWorkDto } from './dto/openToWork.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/authentication/auth.guard';

import { UploadService } from 'src/uploadFile/uploadFile.service';

//TODO
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FormDataBody } from '../company/form-data-body.decorator';

import { unlink } from 'fs';
import { promisify } from 'util';

import { loggedInUserProps } from 'src/utils/types';
import mongoose, { ObjectId, Types } from 'mongoose';
import { imageUploadOptions } from 'src/utils/FileUpload';

const unlinkAsync = promisify(unlink);

@Controller('open-to-work')
export class OpenToWorkController {
  constructor(private OpenToWorkService: OpenToWorkService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOpenToWork(
    @Body() details: OpenToWorkDto,
  ): Promise<{ success: boolean }> {
    return this.OpenToWorkService.createOpenToWork(details);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAllOpenToWork(@Query('is_responded') is_responded: boolean) {
    return this.OpenToWorkService.findAllOpenToWork(is_responded);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async markOpenToWorkRequestAsResponded(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    const _id = new Types.ObjectId(id);
    return this.OpenToWorkService.markOpenToWorkRequestAsResponded(_id);
  }
}
