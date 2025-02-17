import React from "react";
import CompanyJobApplications from "./JobApplications";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pending Job Applications",
};

const page = () => {
  return <CompanyJobApplications />;
};

export default page;
