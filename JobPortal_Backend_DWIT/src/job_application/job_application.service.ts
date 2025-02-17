import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';

import { JobApplication } from './schema/job_application.schema';

import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { sendEmail } from 'src/utils/mail';

interface ApplicantApplicationAcceptProps {
  _id: Types.ObjectId;
  applicantDetails: {
    applicantName: string;
    applicantEmail: string;
    application_status: string;
    appliedRole: string;
    companyName: string;
  };
}

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel(JobApplication.name)
    private JobApplicationModel: mongoose.Model<JobApplication>,
  ) {}

  async createJobApplication(
    jobApplication: JobApplication,
  ): Promise<JobApplication> {
    try {
      return await this.JobApplicationModel.create(jobApplication);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async findByCreatorId(_id: Types.ObjectId): Promise<JobApplication> {
  //   const JobApplication = await this.JobApplicationModel.findOne({ creatorId: _id });

  //   if (!JobApplication) {
  //     throw new NotFoundException('JobApplication Not Found');
  //   }

  //   return JobApplication;
  // }

  async findJobApplicationsByApplicant(
    _id: Types.ObjectId,
  ): Promise<JobApplication[]> {
    const jobApplications = await this.JobApplicationModel.find({
      applicantId: _id,
    })
      .populate({
        path: 'jobId',
        select: 'title role experience',
        populate: [
          {
            path: 'companyId',
            select: 'company',
          },
          {
            path: 'profileId',
            select: 'name',
          },
        ],
      })
      .lean();

    if (!JobApplication) {
      throw new NotFoundException('JobApplication Not Found');
    }

    return jobApplications;
  }

  async findJobApplicationsByCompanyAndAdmin(
    _id: Types.ObjectId,
    applicationStatus: string,
  ): Promise<JobApplication[]> {
    const jobApplications = await this.JobApplicationModel.find({
      companyId: _id,
      application_status: applicationStatus,
    })
      .populate('applicantId')
      .populate({
        path: 'jobId',
        select: 'title role experience',
        populate: [
          {
            path: 'companyId',
            select: 'company',
          },
          {
            path: 'profileId',
            select: 'name',
          },
        ],
      })
      .lean();

    if (!JobApplication) {
      throw new NotFoundException('JobApplication Not Found');
    }
    return jobApplications;
  }

  async verifyApplicantApplication(
    applicantDetailsForVerification: ApplicantApplicationAcceptProps,
  ) {
    try {
      const { _id, applicantDetails } = applicantDetailsForVerification;

      const {
        applicantName,
        applicantEmail,
        appliedRole,
        application_status,
        companyName,
      } = applicantDetails;

      const jobApplication = await this.JobApplicationModel.findById(_id);

      if (!jobApplication) {
        throw new NotFoundException('JobApplication Not Found');
      }

      if (application_status === 'accepted') {
        const templatePath = path.join(
          process.cwd(),
          'src',
          'templates',
          'applicantVerificationTemplate.html',
        );

        const source = fs.readFileSync(templatePath, 'utf-8');

        const template = handlebars.compile(source);

        const status =
          application_status === 'accepted' ? 'shortlisted' : 'rejected';

        const html = template({
          applicantName: applicantName,
          applicationActiveStatus: status,
          appliedRole,
          companyName,
        });

        await sendEmail({
          email: applicantEmail,
          subject: `Shortlisted for the applied role.`,
          html,
        });
      }

      // checking like this because in database schema we have enum, so we cannot directly assign another value to the enum
      if (
        application_status === 'pending' ||
        application_status === 'accepted' ||
        application_status === 'rejected' ||
        application_status === 'dispatched'
      ) {
        jobApplication.application_status = application_status;
      }

      await jobApplication.save();

      return jobApplication;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  // async updateById(_id: Types.ObjectId, JobApplication: JobApplication): Promise<JobApplication> {
  //   return await this.JobApplicationModel.findByIdAndUpdate(_id, JobApplication, {
  //     new: true,
  //     runValidators: true,
  //   });
  // }
}
