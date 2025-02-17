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
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './schema/skill.schema';
import { AuthGuard } from 'src/authentication/auth.guard';

import { loggedInUserProps } from 'src/utils/types';

@Controller('skills')
export class SkillController {
  constructor(private skillService: SkillService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllSkills(@Req() request: loggedInUserProps): Promise<Skill[]> {
    const id = request.user.userId;
    return this.skillService.findAll(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createSkill(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillService.create(createSkillDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getSkill(@Param('id') id: string): Promise<Skill> {
    return this.skillService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateSkill(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.skillService.updateById(id, updateSkillDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteSkill(@Param('id') id: string): Promise<Skill> {
    return this.skillService.deleteById(id);
  }
}
