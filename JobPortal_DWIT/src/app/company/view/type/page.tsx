import type { Metadata } from "next";
import TypePage from "./Type";

export const metadata: Metadata = {
  title: "Type",
};

const page = () => {
  return <TypePage />;
};

export default page;
