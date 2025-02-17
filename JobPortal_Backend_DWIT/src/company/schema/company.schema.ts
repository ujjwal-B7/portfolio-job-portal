import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Company {
  @Prop({ index: true })
  company: string;

  @Prop()
  email: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;
}
export const CompanySchema = SchemaFactory.createForClass(Company);
