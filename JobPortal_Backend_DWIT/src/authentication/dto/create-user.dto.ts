import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Matches,
  MinLength,
  IsDate,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  company_domain?: string;

  @IsString()
  @IsOptional()
  @MinLength(10, {
    message: 'Contact number must be at least 10 digits long',
  })
  @Matches(/^\d+$/, {
    message: 'Contact number must contain only digits',
  })
  contact_number?: string;

  @IsString()
  @IsOptional()
  pan_number?: string;

  @IsString()
  @IsOptional()
  company_pan_image?: string;

  @IsString()
  @IsOptional()
  company_website_url?: string;

  @IsBoolean()
  @IsOptional()
  is_company_active?: boolean;

  @IsEnum(['pending', 'activated', 'deactivated', 'rejected'])
  @IsOptional()
  companyStatus?: 'pending' | 'activated' | 'deactivated' | 'rejected';

  @IsEnum(['employee', 'company', 'admin'])
  @IsOptional()
  role?: 'employee' | 'company' | 'admin';

  @IsString()
  @IsOptional()
  otp?: string;

  @IsDate()
  @IsOptional()
  otpExpiryDate?: Date;

  resetPasswordToken: String;
  resetPasswordTokenExpire: Date;
}
