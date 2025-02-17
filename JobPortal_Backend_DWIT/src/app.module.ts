import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './company/company.module';
import { TitleModule } from './title/title.module';
import { TechnologyModule } from './technology/technology.module';
import { RoleModule } from './role/role.module';
import { DomainModule } from './domain/domain.module';
import { SalaryModule } from './salary/salary.module';
// import { AdminAuthModule} from './admin-auth/admin-auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { TypeModule } from './type/type.module';
import { SkillModule } from './skill/skill.module';
import { OpenToWorkModule } from './open_to_work/openToWork.module';
// import { ImageController } from './image.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { CompanyAuthModule } from './company-auth/company-auth.module';
// import { TypeCopyModule } from './type copy/type.module';

import { ProfileModule } from './profile/profile.module';

//authentication
import { AuthenticationModule } from './authentication/authentication.module';

import { JobApplicationModule } from './job_application/job_application.module';

import { VisitorModule } from './visitor_count/visitor.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JobModule,
    CompanyModule,
    TitleModule,
    TechnologyModule,
    RoleModule,
    DomainModule,
    SalaryModule,
    TypeModule,
    SkillModule,
    VisitorModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'), // change 'public' to your folder name
      serveRoot: '/images',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'companypanimages'), // change 'public' to your folder name
      serveRoot: '/companypanimages',
    }),
    // Serve PDFs
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'job-applications-pdf'),
      serveRoot: '/job-applications-pdf',
    }),
    // MulterModule.register({
    //   dest: './uploads', // Specify the destination folder for uploaded files
    // }),

    AuthenticationModule,
    ProfileModule,
    JobApplicationModule,
    OpenToWorkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
