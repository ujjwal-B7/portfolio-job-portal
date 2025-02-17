import DomainPage from "./Domain";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Domain",
};

const page = () => {
  return <DomainPage />;
};

export default page;
