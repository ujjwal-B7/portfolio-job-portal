import React from "react";
import OtpVerificationPage from "./Otp";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Otp Verification",
};

const page = ({ params }: { params: { _id: string } }) => {
  return <OtpVerificationPage params={params} />;
};

export default page;
