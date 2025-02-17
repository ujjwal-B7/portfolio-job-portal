import DeactivatedCompaniesPage from "./Deactivated";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Deactivated Companies",
};

const page = () => {
  return <DeactivatedCompaniesPage />;
};

export default page;
