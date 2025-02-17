import React from "react";
import ProfileCreatePage from "./CreateProfile";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile page",
};

const page = ({ params }: { params: { profileId: string } }) => {
  return <ProfileCreatePage params={params} />;
};

export default page;
