import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  address: string;

  @Prop({
    select: false,
  })
  password: string;

  @Prop()
  company_domain?: string;

  @Prop({
    minlength: 10,
  })
  contact_number: string;

  @Prop()
  pan_number: string;

  @Prop()
  company_pan_image: string;

  @Prop()
  company_website_url: string;

  @Prop()
  is_company_active: boolean;

  @Prop({ default: 'pending', index: true })
  companyStatus: 'pending' | 'activated' | 'deactivated' | 'rejected';

  @Prop({ default: 'employee' })
  role: 'employee' | 'company' | 'admin';

  @Prop()
  provider?: string; // for google login

  @Prop()
  otp?: string;

  @Prop()
  otpExpiryDate?: Date;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordTokenExpire: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ otpExpiryDate: 1 }, { expireAfterSeconds: 900 });

UserSchema.index({ _id: 1, otp: 1, otpExpiryDate: 1 });
UserSchema.index({ role: 1, companyStatus: 1 });

UserSchema.pre('save', function (next) {
  if (this.role !== 'company') {
    this.companyStatus = undefined;
  }
  next();
});
