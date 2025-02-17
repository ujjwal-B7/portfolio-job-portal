// job/job.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schema/company.schema';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

import { User, UserSchema } from 'src/authentication/schemas/user.schema';
import { UsersController } from 'src/authentication/authentication.cotroller';
import { UsersService } from 'src/authentication/authentication.service';

import { UploadModule } from 'src/uploadFile/uploadFile.module';
import { MeiliSearchService } from 'src/job/meiliSearch.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
    ]),
    UploadModule,
  ],
  controllers: [CompanyController, UsersController],
  providers: [CompanyService, UsersService,MeiliSearchService],
})
export class CompanyModule {}
