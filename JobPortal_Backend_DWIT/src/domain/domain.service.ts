import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Domain } from './schema/domain.schema';

@Injectable()
export class DomainService {
  constructor(
    @InjectModel(Domain.name)
    private DomainModel: mongoose.Model<Domain>,
  ) {}

  async findAll(id: ObjectId): Promise<Domain[]> {
    const Domains = await this.DomainModel.find({ creatorId: id }).sort({
      createdAt: -1,
    });
    return Domains;
  }

  async create(Domain: Domain): Promise<Domain> {
    const existingDomain = await this.DomainModel.findOne({
      domain: { $regex: new RegExp(Domain.domain, 'i') },
      creatorId: Domain.creatorId,
    });
    if (existingDomain) {
      throw new BadRequestException('Domain already exist');
    } else if (Domain.domain == null) {
      throw new BadRequestException("Domain can't be null");
    } else if (/^\s*$/.test(Domain.domain)) {
      throw new BadRequestException('Domain cannot be only whitespace');
    }
    const res = await this.DomainModel.create(Domain);
    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Domain> {
    const Domain = await this.DomainModel.findById(_id);
    if (!Domain) {
      throw new NotFoundException('Domain Not Found');
    }
    return Domain;
  }

  async updateById(_id: Types.ObjectId, Domain: Domain): Promise<Domain> {
    return await this.DomainModel.findByIdAndUpdate(_id, Domain, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Domain> {
    return await this.DomainModel.findByIdAndDelete(_id);
  }
}
