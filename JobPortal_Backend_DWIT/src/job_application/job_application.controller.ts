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
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JobApplicationService } from './job_application.service';
import { JobApplication } from './schema/job_application.schema';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
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
import { imageUploadOptions, pdfUploadOptions } from 'src/utils/FileUpload';

const unlinkAsync = promisify(unlink);

interface ApplicantApplicationAcceptProps {
  applicantName: string;
  applicantEmail: string;
  application_status: string;
  appliedRole: string;
  companyName: string;
}

@Controller('job-application')
export class JobApplicationController {
  constructor(private jobApplicationService: JobApplicationService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv_pdf', maxCount: 1 },
        { name: 'cover_letter_pdf', maxCount: 1 },
      ],
      pdfUploadOptions('./job-applications-pdf'),
    ),
  )
  async createApplication(
    @FormDataBody()
    jobApplication: CreateJobApplicationDto,
    @UploadedFiles()
    files: {
      cv_pdf?: Express.Multer.File[];
      cover_letter_pdf?: Express.Multer.File[];
    },
    @Req() request: { user: { userId: ObjectId } },
  ): Promise<JobApplication> {
    const id = request.user.userId;

    if (!files.cv_pdf || !files.cover_letter_pdf) {
      throw new BadRequestException('Cv and Cover letter files are required');
    }

    const cvPdf = files.cv_pdf[0];
    const coverLetterPdf = files.cover_letter_pdf[0];

    // Construct the file paths
    const cvPdfPath = `job-applications-pdf/${cvPdf.filename}`;
    const coverLetterPdfPath = `job-applications-pdf/${coverLetterPdf.filename}`;

    return this.jobApplicationService.createJobApplication({
      ...jobApplication,
      cv_pdf: cvPdfPath,
      cover_letter_pdf: coverLetterPdfPath,
      applicantId: id,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/accept-applicant-application/:id')
  async verifyApplicantApplication(
    @Param('id') id: string,
    @Body() applicantDetails: ApplicantApplicationAcceptProps,
  ) {
    const _id = new Types.ObjectId(id);
    return this.jobApplicationService.verifyApplicantApplication({
      _id,
      applicantDetails,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/applicant/:id')
  async getAllJobApplicationsByApplicant(
    @Param('id')
    id: string,
  ): Promise<JobApplication[]> {
    const _id = new Types.ObjectId(id);
    return this.jobApplicationService.findJobApplicationsByApplicant(_id);
  }

  @UseGuards(AuthGuard)
  @Get('/company/:id')
  async getAllJobApplicationsByCompanyAndAdmin(
    @Param('id')
    id: string,
    @Query('applicationStatus') applicationStatus: string,
  ): Promise<JobApplication[]> {
    const _id = new Types.ObjectId(id);
    return this.jobApplicationService.findJobApplicationsByCompanyAndAdmin(
      _id,
      applicationStatus,
    );
  }

  // @Get(':id')
  // async getProfile(
  //   @Param('id')
  //   id: string,
  // ): Promise<Profile> {
  //   const _id = new Types.ObjectId(id);
  //   return this.jobApplicationService.findById(_id);
  // }
}
