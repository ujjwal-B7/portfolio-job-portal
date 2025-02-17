import { IsEmail, IsString } from 'class-validator';

export class GoogleSignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  provider: string; // e.g., 'google'
}
