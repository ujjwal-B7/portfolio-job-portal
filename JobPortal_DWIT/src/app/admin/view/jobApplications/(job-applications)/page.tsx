import React from "react";
import AdminJobApplications from "./JobApplications";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Job Applications",
};

const page = () => {
  return <AdminJobApplications />;
};

export default page;
