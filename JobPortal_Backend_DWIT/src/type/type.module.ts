// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Type, TypeSchema } from './schema/type.schema';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]),
  ],
  controllers: [TypeController],
  providers: [TypeService],
})
export class TypeModule {}
