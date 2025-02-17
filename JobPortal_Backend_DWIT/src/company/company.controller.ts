import {
  BadRequestException,
  Bind,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from '../authentication/authentication.service';

import { CompanyService } from './company.service';
import { Company } from './schema/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/authentication/auth.guard';

import { UploadService } from 'src/uploadFile/uploadFile.service';

import { imageUploadOptions } from 'src/utils/FileUpload';

//TODO
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FormDataBody } from './form-data-body.decorator';

import { unlink } from 'fs';
import { promisify } from 'util';

import { loggedInUserProps } from 'src/utils/types';
import { ObjectId, Types } from 'mongoose';

const unlinkAsync = promisify(unlink);

interface VerifySingleCompanyProps {
  companyName: string;
  companyEmail: string;
  customCompanyStatus: string;
}

@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @UseGuards(AuthGuard)
  @Get('/isAdmin')
  async isAdmin() {
    return { message: 'Is admin.' };
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllCompanies(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/all-registered-companies')
  async getAllRegisteredCompaniesForVerification(
    @Query('companyStatus') companyStatus: string,
  ) {
    return this.companyService.getAllRegisteredCompaniesForVerification(
      companyStatus,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/single-registered-company/:id')
  async getSingleRegisteredCompanyDetails(@Param('id') id: string) {
    const _id = new Types.ObjectId(id);
    return this.companyService.getSingleRegisteredCompanyDetails(_id);
  }

  @UseGuards(AuthGuard)
  @Put('/verify-registered-company/:id')
  async verifyRegisteredCompany(
    @Param('id') id: string,
    @Body() companyDetails: VerifySingleCompanyProps,
  ) {
    const _id = new Types.ObjectId(id);
    return this.companyService.verifySingleRegisteredCompany({
      _id,
      companyDetails,
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions('./images')))
  async createCompany(
    @FormDataBody()
    Company: CreateCompanyDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Company> {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const filePath = `images/${image.filename}`;

    return this.companyService.create({
      ...Company,
      logo: filePath,
    });
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions('./images')))
  async updateCompany(
    @Param('id')
    id: string,
    @FormDataBody()
    Company: UpdateCompanyDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Company> {
    const _id = new Types.ObjectId(id);

    // Fetch the current company data
    const currentCompany = await this.companyService.findById(_id);

    let filePath = currentCompany.logo;
    if (image) {
      filePath = `images/${image.filename}`;

      // Delete the old image file if it exists
      if (currentCompany.logo) {
        try {
          await unlinkAsync(currentCompany.logo);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    }

    // const filePath = `images/${image.filename}`;

    return this.companyService.updateById(_id, { ...Company, logo: filePath });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getCompany(
    @Param('id')
    id: string,
  ): Promise<Company> {
    const _id = new Types.ObjectId(id);
    return this.companyService.findById(_id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCompany(
    @Param('id')
    id: string,
  ): Promise<Company> {
    const _id = new Types.ObjectId(id);
    // Fetch the current company data
    const currentCompany = await this.companyService.findById(_id);

    // Delete the old image file if it exists
    if (currentCompany.logo) {
      try {
        await unlinkAsync(currentCompany.logo);
      } catch (err) {
        console.error('Error deleting old image:', err);
      }
    }

    return this.companyService.deleteById(_id);
  }
}
