import JobApplicationPage from "./Applications";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Applications | Employee Dashboard",
};

const page = () => {
  return <JobApplicationPage />;
};

export default page;
