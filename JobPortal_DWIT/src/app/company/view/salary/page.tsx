import SalaryPage from "./Salary";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Salary",
};

const page = () => {
  return <SalaryPage />;
};

export default page;
