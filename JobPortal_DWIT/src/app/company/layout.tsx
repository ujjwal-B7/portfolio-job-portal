import CompanyLayout from "./(layout)/CompanyLayout";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    template: "%s | Company Dashboard",
    default: "Company Dashboard",
  },
};

export default function RootCompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CompanyLayout>{children}</CompanyLayout>;
}
