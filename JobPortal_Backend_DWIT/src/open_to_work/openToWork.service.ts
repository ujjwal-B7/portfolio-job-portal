import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { OpenToWork } from './schema/openToWork.schema';

@Injectable()
export class OpenToWorkService {
  constructor(
    @InjectModel(OpenToWork.name)
    private OpenToWorkModel: mongoose.Model<OpenToWork>,
  ) {}

  async createOpenToWork(details: OpenToWork): Promise<{ success: boolean }> {
    const openToWork = await this.OpenToWorkModel.create(details);

    if (!openToWork) {
      throw new InternalServerErrorException('Failed to create.');
    }

    return { success: true };
  }

  async findAllOpenToWork(is_responded: boolean): Promise<OpenToWork[]> {
    const allOpenToWorks = await this.OpenToWorkModel.find({ is_responded });

    if (!allOpenToWorks) {
      throw new BadRequestException('No data found');
    }

    return allOpenToWorks;
  }

  async markOpenToWorkRequestAsResponded(
    _id: Types.ObjectId,
  ): Promise<{ success: boolean }> {
    const openToWorkRequest = await this.OpenToWorkModel.findById(_id);

    if (!openToWorkRequest) {
      throw new BadRequestException('No employee request found.');
    }

    openToWorkRequest.is_responded = true;

    openToWorkRequest.save();

    return { success: true };
  }
}
