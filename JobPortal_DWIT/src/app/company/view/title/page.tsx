import TitlePage from "./Title";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Title",
};

const page = () => {
  return <TitlePage />;
};

export default page;
