import React from "react";
import AcceptedJobApplications from "./SentToCompanies";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Accepted Job Applications",
};

const page = () => {
  return <AcceptedJobApplications />;
};

export default page;
