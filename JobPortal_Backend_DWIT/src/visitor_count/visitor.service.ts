import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Visitor } from './schema/visitor.schema';

@Injectable()
export class VisitorService {
  constructor(
    @InjectModel(Visitor.name)
    private VisitorModel: mongoose.Model<Visitor>,
  ) {}

  async increaseVisitorCount(): Promise<number> {
    const updatedVisitor = await this.VisitorModel.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true },
    );

    return updatedVisitor.count;
  }
}
