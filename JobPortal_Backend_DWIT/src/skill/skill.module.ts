// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './schema/skill.schema';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';




@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
  ],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
