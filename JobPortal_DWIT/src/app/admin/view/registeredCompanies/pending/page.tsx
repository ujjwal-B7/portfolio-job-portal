import RegisteredCompaniesPage from "./Pending";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pending Companies",
};

const page = () => {
  return <RegisteredCompaniesPage />;
};

export default page;
