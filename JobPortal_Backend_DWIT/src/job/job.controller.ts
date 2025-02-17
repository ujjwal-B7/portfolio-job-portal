import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  Query,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { Job } from './schema/job.schema';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { JobService } from './job.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';

import mongoose, { Types } from 'mongoose';
import { FormDataBody } from 'src/company/form-data-body.decorator';
import { bulkUpload, imageUploadOptions } from 'src/utils/FileUpload';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/user/search')
  async searchJobsByUser(@Query('q') q: string): Promise<Job[] | string[]> {
    return this.jobService.searchJobsByUser(q);
  }

  @UseGuards(AuthGuard)
  @Get('/adminAndCompany/search')
  async searchJobsByAdminAndCompany(
    @Req() request: { user: { userId: string; role: string } },
    @Query('q') q: string,
  ): Promise<Job[]> {
    const { userId, role } = request.user;
    const id = new Types.ObjectId(userId);
    return this.jobService.searchJobsByAdminAndCompany(q, id, role);
  }

  @Get('/users')
  async getAllJobsByUser(
  ): Promise< Job[]> {
    return this.jobService.findAllJobsByUser();
  }

  /*
   /*
  show all jobs in user side
  - with pagination
  - removed for now
  */
  // @Get('/users')
  // async getAllJobsByUser(
  //   @Query('page') page: string,
  // ): Promise<{ jobs: Job[]; jobsCount: number }> {
  //   return this.jobService.findAllJobsByUser(page);
  // }

  @UseGuards(AuthGuard)
  @Get('/adminAndCompany')
  async getAllJobsByAdminAndCompany(
    @Req() request: loggedInUserProps,
    @Query('page') page: string,
  ): Promise<{ jobs: Job[]; jobsCount: number }> {
    const id = request.user.userId;
    return this.jobService.findAll(id, page);
  }

  @UseGuards(AuthGuard)
  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('bulk_upload_file', bulkUpload()))
  async createBulkJobs(
    @Req() request: { user: { userId: string; role: string } },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Job[]> {
    const { userId, role } = request.user;
    if (!file) throw new BadRequestException('File not provided.');
    return this.jobService.createBulkJobs(file, userId, role);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createJob(@Body() job: CreateJobDto): Promise<Job> {
    return this.jobService.create(job);
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async getJob(@Param('id') id: string): Promise<Job> {
    const _id = new Types.ObjectId(id);
    return this.jobService.findById(_id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() job: UpdateJobDto,
  ): Promise<Job> {
    const _id = new Types.ObjectId(id);
    return this.jobService.updateById(_id, job);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: string): Promise<Job> {
    const _id = new Types.ObjectId(id);
    return this.jobService.deleteById(_id);
  }
}
