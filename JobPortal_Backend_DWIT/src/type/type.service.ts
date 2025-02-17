import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { ObjectId, Types } from 'mongoose';
import { Type } from './schema/type.schema';

@Injectable()
export class TypeService {
  constructor(
    @InjectModel(Type.name)
    private typeModel: mongoose.Model<Type>,
  ) {}

  async findAll(id: ObjectId): Promise<Type[]> {
    const types = await this.typeModel
      .find({ creatorId: id })
      .sort({ createdAt: -1 });
    return types;
  }

  async create(types: Type): Promise<Type> {
    const existingType = await this.typeModel.findOne({
      types: { $regex: new RegExp(types.types, 'i') },
      creatorId: types.creatorId,
    });
    if (existingType) {
      throw new BadRequestException('Type already exist');
    } else if (types.types == null) {
      throw new BadRequestException("Type can't be null");
    } else if (/^\s*$/.test(types.types)) {
      throw new BadRequestException('Type cannot be only whitespace');
    }
    const res = await this.typeModel.create(types);
    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Type> {
    const types = await this.typeModel.findById(_id);
    if (!types) {
      throw new NotFoundException('Type Not Found');
    }
    return types;
  }

  async updateById(_id: Types.ObjectId, types: Type): Promise<Type> {
    return await this.typeModel.findByIdAndUpdate(_id, types, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Type> {
    return await this.typeModel.findByIdAndDelete(_id);
  }
}
