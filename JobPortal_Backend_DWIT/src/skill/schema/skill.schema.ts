import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true, unique: true, type: [String] })
  skills: string[];
}

export const SkillSchema = SchemaFactory.createForClass(Skill);