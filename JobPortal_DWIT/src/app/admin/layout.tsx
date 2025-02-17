import { Metadata } from "next";
import AdminLayout from "./(layout)/AdminLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Dashboard",
    default: "Admin Dashboard",
  },
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
