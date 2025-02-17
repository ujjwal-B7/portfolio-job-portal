import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Salary } from './schema/salary.schema';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name)
    private SalaryModel: mongoose.Model<Salary>,
  ) {}

  async findAll(id: ObjectId): Promise<Salary[]> {
    const Salaries = await this.SalaryModel.find({ creatorId: id }).sort({
      createdAt: -1,
    });
    return Salaries;
  }

  async create(Salary: Salary): Promise<Salary> {
    const existingSalary = await this.SalaryModel.findOne({
      salary: { $regex: new RegExp(Salary.salary, 'i') },
      creatorId: Salary.creatorId,
    });
    if (existingSalary) {
      throw new BadRequestException('Salary already exist');
    } else if (Salary.salary == null) {
      throw new BadRequestException("Salary can't be null");
    } else if (/^\s*$/.test(Salary.salary)) {
      throw new BadRequestException('Salary cannot be only whitespace');
    }
    const res = await this.SalaryModel.create(Salary);
    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Salary> {
    const Salary = await this.SalaryModel.findById(_id);
    if (!Salary) {
      throw new NotFoundException('Salary Not Found');
    }
    return Salary;
  }

  async updateById(_id: Types.ObjectId, Salary: Salary): Promise<Salary> {
    return await this.SalaryModel.findByIdAndUpdate(_id, Salary, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Salary> {
    return await this.SalaryModel.findByIdAndDelete(_id);
  }
}
