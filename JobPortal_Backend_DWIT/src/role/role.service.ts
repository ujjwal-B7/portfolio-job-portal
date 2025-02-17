import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Role } from './schema/role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private RoleModel: mongoose.Model<Role>,
  ) {}

  async findAll(id: ObjectId): Promise<Role[]> {
    const Roles = await this.RoleModel.find({ creatorId: id }).sort({
      createdAt: -1,
    });
    return Roles;
  }

  async create(Role: Role): Promise<Role> {
    const existingRole = await this.RoleModel.findOne({
      role: { $regex: new RegExp(Role.role, 'i') },
      creatorId: Role.creatorId,
    });
    if (existingRole) {
      throw new BadRequestException('Role already exist');
    } else if (Role.role == null) {
      throw new BadRequestException("Role can't be null");
    } else if (/^\s*$/.test(Role.role)) {
      throw new BadRequestException('Role cannot be only whitespace');
    }
    const res = await this.RoleModel.create(Role);
    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Role> {
    const Role = await this.RoleModel.findById(_id);
    if (!Role) {
      throw new NotFoundException('Role Not Found');
    }
    return Role;
  }

  async updateById(_id: Types.ObjectId, Role: Role): Promise<Role> {
    return await this.RoleModel.findByIdAndUpdate(_id, Role, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Role> {
    return await this.RoleModel.findByIdAndDelete(_id);
  }
}
