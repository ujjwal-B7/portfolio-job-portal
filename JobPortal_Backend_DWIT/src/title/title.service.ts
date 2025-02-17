import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Title } from './schema/title.schema';
import mongoose, { ObjectId, Types } from 'mongoose';

@Injectable()
export class TitleService {
  constructor(
    @InjectModel(Title.name) private titleModel: mongoose.Model<Title>,
  ) {}

  async findAll(id: ObjectId): Promise<Title[]> {
    const titles = await this.titleModel
      .find({ creatorId: id })
      .sort({ createdAt: -1 });
    return titles;
  }

  async create(title: Title): Promise<Title> {
    const existingTitle = await this.titleModel.findOne({
      title: { $regex: new RegExp(title.title, 'i') },
      creatorId: title.creatorId,
    });

    if (existingTitle) {
      throw new BadRequestException('Title already exists');
    } else if (/^\s*$/.test(title.title)) {
      throw new BadRequestException('Title cannot be only whitespace');
    }

    const res = await this.titleModel.create(title);
    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Title> {
    const title = await this.titleModel.findById(_id);

    if (!title) {
      throw new NotFoundException('Title Not Found');
    }

    return title;
  }

  async updateById(_id: Types.ObjectId, titleDto: Title): Promise<Title> {
    // const existingTitle = await this.titleModel.findOne({
    //   _id: { $ne: id },
    //   title: titleDto.title,
    // });

    // if (existingTitle) {
    //   throw new BadRequestException('Title already exists');
    // }

    return await this.titleModel.findByIdAndUpdate(_id, titleDto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Title> {
    return await this.titleModel.findByIdAndDelete(_id);
  }
}
