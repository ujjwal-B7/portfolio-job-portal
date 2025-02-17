import AuthForm from "@/components/auth/AuthForm";
import UnderMaintainance from "@/components/ui/UnderMaintainance";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Login",
};

export default function CompanyLogin() {
  return (
    <>
      <UnderMaintainance />
      <AuthForm type="login" authenticateAs="company" />
    </>
  );
}
