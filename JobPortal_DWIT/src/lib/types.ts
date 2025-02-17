// types.ts
export interface Job {
  _id: string;
  title: string;
  logo: string;
  companydescription: string;
  description: string;
  qualification: string;
  salary: string;
  experience: string;
  location: string;
  technology: string;
  type: string;
  role: string;
  applicationDeadline: string;
  link: string;
  company: string;
  domain: string;
  applicationStart: string;
  creatorId?: string;
  companyId: {
    company: string;
    description: string;
    logo: string;
  };
  profileId: {
    name: string;
    description: string;
    logo: string;
  };
  entityName: string;
  entityLogo: string;
  entityDescription: string;
}

export interface Title {
  _id: string;
  title: string;
}
export interface Domain {
  _id: string;
  domain: string;
}
export interface Technology {
  _id: string;
  technology: string;
}
export interface Role {
  _id: string;
  role: string;
}
export interface Salary {
  _id: string;
  salary: string;
}
export interface Type {
  _id: string;
  types: string;
}

export interface Company {
  _id: string;
  company: string;
  description: string;
  // logo: string;
  logo: string | File;
}

export interface Profile {
  _id: string;
  name: string;
  description: string;
  // logo: string;
  logo: string | File;
}

export interface UserProfile {
  _id: string;
  name: string | null;
  email: string | null;
  phone_number: string;
  about_yourself: string;
  profile_picture: string | File;
  location: string;
  experience: {
    job_title: string;
    previous_organization: string;
    job_type: string; // intern, full time
    job_location: string;
    join_date: string;
    end_date: string;
  }[];
  education: {
    degree_title: string; // bachelors in It
    degree_type: string; // bachelor, phd
    college_name: string;
    join_date: string;
    end_date: string;
  }[];
  skills: string;
  project_profile: {
    project_title: string;
    project_link: string;
    project_description: string;
    project_start_date: string;
    project_end_date: string;
  }[];
  language: string;
  socialMediaLinks: {
    type: string; //facebook instagram
    url: string;
  }[];
}

export interface RegisteredCompanies {
  _id: string;
  address: string;
  company_domain: string;
  company_pan_image: string;
  pan_number: string;
  contact_number: string;
  email: string;
  is_company_active: boolean;
  company_website_url: string;
  companyStatus: string;
  name: string;
}

export interface JobApplication {
  _id: string;

  application_status: string;
  experience: string;
  createdAt: string;

  //for admin
  applicantId?: {
    _id: string;
    name: string;
    email: string;
    contact_number: string;
  };

  jobId: {
    _id: string;
    companyId: {
      _id: string;
      company: string;
    };
    profileId: {
      _id: string;
      name: string;
    };
    title: string;
    role: string;
    experience: string;
  };

  cv_pdf: string;
  cover_letter_pdf: string;
}

export interface CompaniesStatus {
  company: RegisteredCompanies;
  index: number;
  refetch: () => void;
  currentPage: number;
  dataPerPage: number;
}

// Use a union type for the array element types
export type AllDataUnion =
  | Job[]
  | Title[]
  | Company[]
  | Domain[]
  | Technology[]
  | Role[]
  | Salary[]
  | Type[]
  | RegisteredCompanies[]
  | JobApplication[];

export type AllDataUnionObject =
  | Job
  | Title
  | Company
  | Domain
  | Technology
  | Role
  | Salary
  | Type
  | RegisteredCompanies;

export interface OpenToWork {
  _id: string;
  job_title: string;
  employee_name: string;
  email: string;
  contact_number: string;
  salary: string;
  degree: string;
  experience: string;
  skills_array: string[];
}
