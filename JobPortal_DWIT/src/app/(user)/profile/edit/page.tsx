import UserProfileForm from "@/components/user/forms/UserProfile";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Edit Profile | Employee Dashboard",
};

const ProfileEditPage = () => {
  return (
    <section className="bg-gray-100 pt-6">
      <div className="max-w-large mx-auto bg-white shadow-lg px-4 py-6 font-switzer-regular rounded-md">
        <h1 className="text-2xl text-center font-bold mb-6">Edit Profile</h1>
        <UserProfileForm type="editProfile" />
      </div>
    </section>
  );
};

export default ProfileEditPage;
