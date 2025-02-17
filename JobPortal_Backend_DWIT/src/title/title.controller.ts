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
import { TitleService } from './title.service';
import { Title } from './schema/title.schema';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { title } from 'process';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';
import { Types } from 'mongoose';

@Controller('titles')
export class TitleController {
  constructor(private titleService: TitleService) {}

  // get all titles
  @UseGuards(AuthGuard)
  @Get()
  async getAllTitles(@Req() request: loggedInUserProps): Promise<Title[]> {
    const id = request.user.userId;
    return this.titleService.findAll(id);
  }

  //create title
  @UseGuards(AuthGuard)
  @Post()
  async createTitle(
    @Body()
    title: CreateTitleDto,
  ): Promise<Title> {
    return this.titleService.create(title);
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async getTitle(
    @Param('id')
    id: string,
  ): Promise<Title> {
    const _id = new Types.ObjectId(id);
    return this.titleService.findById(_id);
  }

  // update title
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTitle(
    @Param('id')
    id: string,
    @Body()
    title: UpdateTitleDto,
  ): Promise<Title> {
    const _id = new Types.ObjectId(id);
    return this.titleService.updateById(_id, title);
  }

  // delete title
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTitle(
    @Param('id')
    id: string,
  ): Promise<Title> {
    const _id = new Types.ObjectId(id);
    return this.titleService.deleteById(_id);
  }
}
