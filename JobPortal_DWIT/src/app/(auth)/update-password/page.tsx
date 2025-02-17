import React from "react";
import UpdatePasswordForm from "./UpdatePassword";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Password",
};

const page = () => {
  return <UpdatePasswordForm />;
};

export default page;
