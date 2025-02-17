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
import { DomainService } from './domain.service';
import { Domain } from './schema/domain.schema';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';
import { Types } from 'mongoose';

@Controller('domains')
export class DomainController {
  constructor(private DomainService: DomainService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllDomains(@Req() request: loggedInUserProps): Promise<Domain[]> {
    const id = request.user.userId;
    return this.DomainService.findAll(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createDomain(
    @Body()
    Domain: CreateDomainDto,
  ): Promise<Domain> {
    return this.DomainService.create(Domain);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getDomain(
    @Param('id')
    id: string,
  ): Promise<Domain> {
    const _id = new Types.ObjectId(id);
    return this.DomainService.findById(_id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateDomain(
    @Param('id')
    id: string,
    @Body()
    Domain: UpdateDomainDto,
  ): Promise<Domain> {
    const _id = new Types.ObjectId(id);
    return this.DomainService.updateById(_id, Domain);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteDomain(
    @Param('id')
    id: string,
  ): Promise<Domain> {
    const _id = new Types.ObjectId(id);
    return this.DomainService.deleteById(_id);
  }
}
