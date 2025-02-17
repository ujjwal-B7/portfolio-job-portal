import RejectedJobApplications from "./Rejected";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rejected Job Applications",
};

const page = () => {
  return <RejectedJobApplications />;
};

export default page;
