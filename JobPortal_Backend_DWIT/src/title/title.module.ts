// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Title, TitleSchema } from './schema/title.schema';
import { TitleController } from './title.controller';
import { TitleService } from './title.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Title.name, schema: TitleSchema }]),
  ],
  controllers: [TitleController],
  providers: [TitleService],
})
export class TitleModule {}
