import React from "react";
import ForgotPasswordForm from "./ForgotPassword";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forgot Password",
};

const page = () => {
  return <ForgotPasswordForm />;
};

export default page;
