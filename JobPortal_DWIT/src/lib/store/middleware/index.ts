import { authenticationApi } from "../features/authenticationApi";

//api's
import { jobsApi } from "../features/jobsApi";
import { titleApi } from "../features/titleApi";
import { companyApi } from "../features/companyApi";
import { domainApi } from "../features/domainApi";
import { technologyApi } from "../features/technologyApi";
import { roleApi } from "../features/roleApi";
import { salaryApi } from "../features/salaryApi";
import { typeApi } from "../features/typeApi";
import { profileApi } from "../features/profileApi";
import { registeredCompaniesApi } from "../features/registeredCompaniesApi";
import { jobApplicationApi } from "../features/jobApplicationApi";
import { applicantApi } from "../features/applicantApi";
import { openToWorkApi } from "../features/openToWorkApi";

export const apiMiddlewares = [
  authenticationApi.middleware,
  jobsApi.middleware,
  titleApi.middleware,
  companyApi.middleware,
  domainApi.middleware,
  technologyApi.middleware,
  roleApi.middleware,
  salaryApi.middleware,
  typeApi.middleware,
  profileApi.middleware,
  registeredCompaniesApi.middleware,
  jobApplicationApi.middleware,
  applicantApi.middleware,
  openToWorkApi.middleware,
];
