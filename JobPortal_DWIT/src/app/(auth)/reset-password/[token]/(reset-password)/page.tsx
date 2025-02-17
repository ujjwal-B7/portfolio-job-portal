import React from "react";
import ResetPassword from "./ResetPassword";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reset Password",
};

const page = ({ params }: { params: { token: string } }) => {
  return <ResetPassword params={params} />;
};

export default page;
