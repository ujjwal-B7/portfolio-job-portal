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
import { SalaryService } from './salary.service';
import { Salary } from './schema/salary.schema';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';
import { Types } from 'mongoose';

@Controller('salaries')
export class SalaryController {
  constructor(private SalaryService: SalaryService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllSalarys(@Req() request: loggedInUserProps): Promise<Salary[]> {
    const id = request.user.userId;
    return this.SalaryService.findAll(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createSalary(
    @Body()
    Salary: CreateSalaryDto,
  ): Promise<Salary> {
    return this.SalaryService.create(Salary);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getSalary(
    @Param('id')
    id: string,
  ): Promise<Salary> {
    const _id = new Types.ObjectId(id);
    return this.SalaryService.findById(_id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateSalary(
    @Param('id')
    id: string,
    @Body()
    Salary: UpdateSalaryDto,
  ): Promise<Salary> {
    const _id = new Types.ObjectId(id);
    return this.SalaryService.updateById(_id, Salary);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteSalary(
    @Param('id')
    id: string,
  ): Promise<Salary> {
    const _id = new Types.ObjectId(id);
    return this.SalaryService.deleteById(_id);
  }
}
