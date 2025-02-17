import AuthForm from "@/components/auth/AuthForm";
import UnderMaintainance from "@/components/ui/UnderMaintainance";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Login",
};

export default function EmployeeLogin() {
  return (
    <>
      <UnderMaintainance />
      <AuthForm type="login" authenticateAs="employee" />
    </>
  );
}
