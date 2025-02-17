import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Skill } from './schema/skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name) private skillModel: mongoose.Model<Skill>,
  ) {}

  async findAll(id: ObjectId): Promise<Skill[]> {
    return this.skillModel.find({ creatorId: id }).sort({ createdAt: -1 });
  }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const newSkill = await this.skillModel.create(createSkillDto);
    return newSkill;
  }

  async findById(id: string): Promise<Skill> {
    const skill = await this.skillModel.findById(id);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async updateById(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    return this.skillModel.findByIdAndUpdate(id, updateSkillDto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Skill> {
    return this.skillModel.findByIdAndDelete(id);
  }
}
