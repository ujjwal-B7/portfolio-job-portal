import RejectedCompaniesPage from "./Rejected";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rejected Companies",
};

const page = () => {
  return <RejectedCompaniesPage />;
};

export default page;
