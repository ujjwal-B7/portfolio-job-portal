// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Domain, DomainSchema } from './schema/domain.schema';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Domain.name, schema: DomainSchema }]),
  ],
  controllers: [DomainController],
  providers: [DomainService],
})
export class DomainModule {}
