// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobService } from './job.service';
import { MeiliSearchService } from './meiliSearch.service';
import { JobController } from './job.controller';
import { Job, JobSchema } from './schema/job.schema';
import { CompanyModule } from 'src/company/company.module';
import { Company, CompanySchema } from 'src/company/schema/company.schema';
import { Profile, ProfileSchema } from 'src/profile/schema/profile.schema';
import { CacheService } from './nodecache.service';
// import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
@Module({
  imports: [
    // AdminAuthModule,
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [JobController],
  providers: [JobService, MeiliSearchService, CacheService],
})
export class JobModule {}
