import CompanyRegisterForm from "@/components/auth/CompanyRegisterForm";
import UnderMaintainance from "@/components/ui/UnderMaintainance";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Register",
};

export default function CompanyRegister() {
  return (
    <>
      <UnderMaintainance />
      <CompanyRegisterForm type="register" authenticateAs="company" />
    </>
  );
}
