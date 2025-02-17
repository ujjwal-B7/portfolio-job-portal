import AuthForm from "@/components/auth/AuthForm";
import UnderMaintainance from "@/components/ui/UnderMaintainance";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Register",
};

export default function EmployeeRegister() {
  return (
    <>
      <UnderMaintainance />
      <AuthForm type="register" authenticateAs="employee" />
    </>
  );
}
