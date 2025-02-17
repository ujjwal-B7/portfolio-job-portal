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
import { TechnologyService } from './technology.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { Technology } from './schema/technology.schema';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';
import { Types } from 'mongoose';
@Controller('technologies')
export class TechnologyController {
  constructor(private TechnologyService: TechnologyService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllTechnologys(
    @Req() request: loggedInUserProps,
  ): Promise<Technology[]> {
    const id = request.user.userId;
    return this.TechnologyService.findAll(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createTechnology(
    @Body()
    Technology: CreateTechnologyDto,
  ): Promise<Technology> {
    return this.TechnologyService.create(Technology);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTechnology(
    @Param('id')
    id: string,
  ): Promise<Technology> {
    const _id = new Types.ObjectId(id);
    return this.TechnologyService.findById(_id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTechnology(
    @Param('id')
    id: string,
    @Body()
    Technology: UpdateTechnologyDto,
  ): Promise<Technology> {
    const _id = new Types.ObjectId(id);
    return this.TechnologyService.updateById(_id, Technology);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTechnology(
    @Param('id')
    id: string,
  ): Promise<Technology> {
    const _id = new Types.ObjectId(id);
    return this.TechnologyService.deleteById(_id);
  }
}
