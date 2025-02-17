import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Profile {
  @Prop()
  name: string;

  @Prop()
  email?: string;

  @Prop()
  phone_number?: string;

  @Prop()
  description: string; //about yourself for applicant

  @Prop()
  logo?: string; // profile_picture for applicant

  @Prop()
  location?: string;

  @Prop()
  experience?: {
    job_title: string;
    previous_organization: string;
    job_type: string; // intern, full time
    job_location: string;
    join_date: string;
    end_date: string;
  }[];

  @Prop()
  education?: {
    degree_title: string; // bachelors in It
    degree_type: string; // bachelor, phd
    college_name: string;
    join_date: string;
    end_date: string;
  }[];

  @Prop()
  skills?: string;

  @Prop()
  project_profile?: {
    project_title: string;
    project_link: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
  }[];

  @Prop()
  language?: string;

  @Prop()
  socialMediaLinks?: {
    type: string; //facebook, instagram
    url: string;
  }[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  creatorId: mongoose.Schema.Types.ObjectId;

  //   cleanProfileFields(role: string) {
  //     if (role === 'company') {
  //       // toObject converst into pure object removing _id,_v properties
  //       const doc = this.toObject();

  //       // iterating over enumarable( that can be iterated ) properties of a objects keys as objects can be iterated through for..in loop or Object.keys()
  //       for (const key in doc) {
  //         const value = doc[key];
  //         if (
  //           value === '' ||
  //           (Array.isArray(value) && value.length === 0) ||
  //           (typeof value === 'object' &&
  //             value !== null &&
  //             !Array.isArray(value) &&
  //             Object.keys(value).length === 0)
  //         ) {
  //           doc[key] = undefined;
  //         }
  //       }
  //     }
  //   }
}
export const ProfileSchema = SchemaFactory.createForClass(Profile);

// ProfileSchema.methods.cleanProfileFields = function (role: string) {
//   if (role === 'company') {
//     // toObject converst into pure object removing _id,_v properties
//     const doc = this.toObject() as Profile;

//     // iterating over enumarable( that can be iterated ) properties of a objects keys as objects can be iterated through for..in loop or Object.keys()
//     for (const key in doc) {
//       const value = doc[key];
//       if (
//         value === '' ||
//         (Array.isArray(value) && value.length === 0) ||
//         (typeof value === 'object' &&
//           value !== null &&
//           !Array.isArray(value) &&
//           Object.keys(value).length === 0)
//       ) {
//         doc[key] = undefined;
//       }
//     }
//   }
// };
// ProfileSchema.pre('save', function (next) {
//   // toObject converst into pure object removing _id,_v properties
//   const doc = this.toObject() as Profile;

//   // iterating over enumarable( that can be iterated ) properties of a objects keys as objects can be iterated through for..in loop or Object.keys()
//   for (const key in doc) {
//     const value = doc[key];

//     if (
//       value === '' ||
//       (Array.isArray(value) && value.length === 0) ||
//       (typeof value === 'object' &&
//         value !== null &&
//         !Array.isArray(value) &&
//         Object.keys(value).length === 0)
//     ) {
//       doc[key] = undefined;
//     }
//   }
//   next();
// });
