import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './authentication.service';

import { CreateUserDto } from './dto/create-user.dto';

//response body like express
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FormDataBody } from 'src/company/form-data-body.decorator';
import { imageUploadOptions } from 'src/utils/FileUpload';

import {
  loggedInUserProps,
  ResetPasswordProp,
  UpdatePasswordProp,
} from 'src/utils/types';
import { AuthGuard } from './auth.guard';
import { ObjectId, Types } from 'mongoose';
import { GoogleSignupDto } from './dto/google-signup.dto';

interface OtpProps {
  otp: string;
}

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/google')
  async authWithGoogle(@Body() googleSignupDto: GoogleSignupDto) {
    // Only name, email, and provider are validated
    return this.usersService.employeeAuthThroughGoogle(googleSignupDto);
  }

  //company register
  @Post('/register/company')
  @UseInterceptors(
    FileInterceptor('image', imageUploadOptions('./companypanimages')),
  )
  registerCompany(
    @FormDataBody() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const filePath = `companypanimages/${image.filename}`;

    console.log('filepath', filePath, createUserDto);

    return this.usersService.registerUser({
      ...createUserDto,
      company_pan_image: filePath,
      is_company_active: false,
    });
  }

  //user,admin register
  @Post('/register')
  registerUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  //user,company,admin login
  @Post('/login')
  loginUser(@Body(ValidationPipe) loginUser: LoginUserDto) {
    return this.usersService.loginUser(loginUser);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() userEmail: any) {
    return this.usersService.forgotPassword(userEmail);
  }

  @Put('/reset-password/:token')
  resetPassword(
    @Body() passwords: ResetPasswordProp,
    @Param('token') token: string,
  ) {
    return this.usersService.resetPassword(passwords, token);
  }

  @UseGuards(AuthGuard)
  @Put('/update-password')
  updatePassword(
    @Body() passwords: UpdatePasswordProp,
    @Req() request: loggedInUserProps,
  ) {
    const _id = request.user.userId;
    return this.usersService.updatePassword(passwords, _id);
  }

  @Post('/verify-otp/:_id')
  verifyOtp(@Body() data: OtpProps, @Param('_id') _id: string) {
    return this.usersService.verifyOtp(data, _id);
  }
}
