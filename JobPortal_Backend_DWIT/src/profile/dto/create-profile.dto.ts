import mongoose from 'mongoose';

export class CreateProfileDto {
  readonly name: string;
  readonly email?: string;
  readonly phone_number?: string;
  readonly description: string;
  readonly logo?: string;
  readonly location?: string;

  readonly experience?: {
    job_title: string;
    previous_organization: string;
    job_type: string;
    job_location: string;
    join_date: string;
    end_date: string;
  }[];

  readonly education?: {
    degree_title: string;
    degree_type: string;
    college_name: string;
    join_date: string;
    end_date: string;
  }[];

  readonly skills?: string;

  readonly project_profile?: {
    project_title: string;
    project_link: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
  }[];

  readonly language?: string;

  readonly socialMediaLinks?: {
    type: string;
    url: string;
  }[];

  readonly creatorId: mongoose.Schema.Types.ObjectId;
}
