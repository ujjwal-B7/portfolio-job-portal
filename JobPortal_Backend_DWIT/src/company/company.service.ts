import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { Company } from './schema/company.schema';
import { User } from 'src/authentication/schemas/user.schema';

import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { sendEmail } from 'src/utils/mail';

import { MeiliSearchService } from '../job/meiliSearch.service';

interface VerifySingleCompanyProps {
  _id: Types.ObjectId;
  companyDetails: {
    companyName: string;
    companyEmail: string;
    customCompanyStatus: string;
  };
}

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private CompanyModel: mongoose.Model<Company>,
    @InjectModel(User.name) private UserModel: mongoose.Model<User>,
    private meiliSearchService: MeiliSearchService,
  ) {}

  async findAll(): Promise<Company[]> {
    // await this.indexAllCompaniesInMeiliSearch()
    const Companies = await this.CompanyModel.find().sort({
      createdAt: -1,
    });
    return Companies;
  }

  // get all registered companies by admin for verification
  async getAllRegisteredCompaniesForVerification(companyStatus: string) {
    const companies = await this.UserModel.find({
      role: 'company',
      companyStatus,
    });

    return companies;
  }

  async getSingleRegisteredCompanyDetails(_id: Types.ObjectId) {
    const company = await this.UserModel.findById(_id);
    return company;
  }

  // company verify by admin whether it is genuine or not
  async verifySingleRegisteredCompany(
    companyDetailsForVerification: VerifySingleCompanyProps,
  ) {
    const { _id, companyDetails } = companyDetailsForVerification;
    const { companyName, companyEmail, customCompanyStatus } = companyDetails;

    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'companyAcceptedTemplate.html',
    );

    const source = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(source);
    const html = template({ companyName, customCompanyStatus });

    try {
      await sendEmail({
        email: companyEmail,
        subject: `Company account ${customCompanyStatus}.`,
        html,
      });

      const company = await this.UserModel.findOne({ email: companyEmail });

      if (customCompanyStatus === 'deactivated') {
        company.is_company_active = false;
        company.companyStatus = 'deactivated';
      } else if (
        customCompanyStatus === 'verified' ||
        customCompanyStatus === 'activated'
      ) {
        company.is_company_active = true;
        company.companyStatus = 'activated';
      } else {
        company.is_company_active = false;
        company.companyStatus = 'rejected';
      }

      await company.save();

      return { success: true, company };
    } catch (error) {
      console.log('COMPANY_VERIFY_ERROR', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  // Method to index all companies in MeiliSearch for the first time
  async indexAllCompaniesInMeiliSearch(): Promise<void> {
    const allCompanies = await this.CompanyModel.find(); // Fetch all existing jobs from MongoDB

    // If no jobs exist, don't attempt indexing
    if (allCompanies.length === 0) {
      console.log('No companies to index.');
      return;
    }

    // Ensure the index exists with the correct primary key
    await this.meiliSearchService.createIndexIfNotExists('indexed_companies'); // '_id' or another unique field

    // Index all jobs into MeiliSearch
    await this.meiliSearchService.indexCompanies(allCompanies);
    console.log(
      `${allCompanies.length} companies have been indexed in MeiliSearch.`,
    );
  }

  // create company by admin
  async create(company: Company): Promise<Company> {
    const existingCompany = await this.CompanyModel.findOne({
      company: { $regex: new RegExp(`^${company.company}$`, 'i') },
    });
    if (existingCompany) {
      throw new ConflictException('Company with the same name already exists.');
    }

    const res = await this.CompanyModel.create(company);

    await this.meiliSearchService.indexCompanies([res]);

    return res;
  }

  async findById(_id: Types.ObjectId): Promise<Company> {
    const Company = await this.CompanyModel.findById(_id);
    if (!Company) {
      throw new NotFoundException('Company Not Found');
    }
    return Company;
  }

  async updateById(_id: Types.ObjectId, Company: Company): Promise<Company> {
    return await this.CompanyModel.findByIdAndUpdate(_id, Company, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(_id: Types.ObjectId): Promise<Company> {
    return await this.CompanyModel.findByIdAndDelete(_id);
  }
}
