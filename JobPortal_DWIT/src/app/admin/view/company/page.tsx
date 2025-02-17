import CompanyPage from "./Company";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Companies",
};

const page = () => {
  return <CompanyPage />;
};

export default page;
