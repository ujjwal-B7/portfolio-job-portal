import ActivatedCompaniesPage from "./Activated";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Activated Companies",
};

const page = () => {
  return <ActivatedCompaniesPage />;
};

export default page;
