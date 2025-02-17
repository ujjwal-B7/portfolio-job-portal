import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Technology } from './schema/technology.schema';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectModel(Technology.name)
    private TechnologyModel: mongoose.Model<Technology>,
  ) {}

  async findAll(id: ObjectId): Promise<Technology[]> {
    const Technologies = await this.TechnologyModel.find({
      creatorId: id,
    }).sort({
      createdAt: -1,
    });
    return Technologies;
  }

  async create(Technology: Technology): Promise<Technology> {
    const existingTech = await this.TechnologyModel.findOne({
      technology: { $regex: new RegExp(Technology.technology, 'i') },
      creatorId: Technology.creatorId,
    });
    if (existingTech) {
      throw new BadRequestException('Technology already exist');
    } else if (Technology.technology == null) {
      throw new BadRequestException("Technology can't be null");
    } else if (/^\s*$/.test(Technology.technology)) {
      throw new BadRequestException('Technology cannot be only whitespace');
    }
    const res = await this.TechnologyModel.create(Technology);
    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Technology> {
    const Technology = await this.TechnologyModel.findById(_id);
    if (!Technology) {
      throw new NotFoundException('Technology Not Found');
    }
    return Technology;
  }

  async updateById(
    _id: Types.ObjectId,
    Technology: Technology,
  ): Promise<Technology> {
    return await this.TechnologyModel.findByIdAndUpdate(_id, Technology, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Technology> {
    return await this.TechnologyModel.findByIdAndDelete(_id);
  }
}
