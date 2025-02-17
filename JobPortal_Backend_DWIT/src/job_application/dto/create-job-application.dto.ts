import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateJobApplicationDto {
 
  @IsNotEmpty()
  readonly experience: string;

  @IsNotEmpty()
  readonly cv_pdf: string;

  @IsNotEmpty()
  readonly cover_letter_pdf: string;

  @IsEnum(['pending', 'accepted', 'rejected', 'dispatched'])
  @IsOptional()
  application_status?: 'pending' | 'accepted' | 'rejected' | 'dispatched';

  @IsNotEmpty()
  readonly jobId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  readonly companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  readonly applicantId: mongoose.Schema.Types.ObjectId;
}
