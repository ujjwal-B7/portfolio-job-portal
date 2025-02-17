import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';
import { Types } from 'mongoose';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllRoles(@Req() request: loggedInUserProps): Promise<Role[]> {
    const id = request.user.userId;
    return this.roleService.findAll(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createRole(
    @Body()
    Role: CreateRoleDto,
  ): Promise<Role> {
    return this.roleService.create(Role);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getRole(
    @Param('id')
    id: string,
  ): Promise<Role> {
    const _id = new Types.ObjectId(id);
    return this.roleService.findById(_id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateRole(
    @Param('id')
    id: string,
    @Body()
    Role: UpdateRoleDto,
  ): Promise<Role> {
    const _id = new Types.ObjectId(id);
    return this.roleService.updateById(_id, Role);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteRole(
    @Param('id')
    id: string,
  ): Promise<Role> {
    const _id = new Types.ObjectId(id);
    return this.roleService.deleteById(_id);
  }
}
