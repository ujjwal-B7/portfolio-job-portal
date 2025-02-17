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

import { CreateTypeDto } from './dto/create-type.dto';
import { Type } from './schema/type.schema';
import { TypeService } from './type.service';
import { UpdateTypeDto } from './dto/update-type.dto';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';
import { Types } from 'mongoose';

@Controller('types')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllTypes(@Req() request: loggedInUserProps): Promise<Type[]> {
    const id = request.user.userId;

    return this.typeService.findAll(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createType(
    @Body()
    types: CreateTypeDto,
  ): Promise<Type> {
    return this.typeService.create(types);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getType(
    @Param('id')
    id: string,
  ): Promise<Type> {
    const _id = new Types.ObjectId(id);
    return this.typeService.findById(_id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateType(
    @Param('id')
    id: string,
    @Body()
    types: UpdateTypeDto,
  ): Promise<Type> {
    const _id = new Types.ObjectId(id);
    return this.typeService.updateById(_id, types);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteType(
    @Param('id')
    id: string,
  ): Promise<Type> {
    const _id = new Types.ObjectId(id);
    return this.typeService.deleteById(_id);
  }
}
