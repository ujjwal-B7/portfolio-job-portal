"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

import ProfileForm from "@/components/company/forms/CreateProfile";

import { useGetSingleProfileDetailsByCreatorIdQuery } from "@/lib/store/features/profileApi";
import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const ProfilePage = () => {
  const [showProfileEditForm, setShowEditProfileForm] = useToggle();
  const { loggedInUserId, address } = useSelector(
    (state: RootState) => state.authenticated
  );

  const { data: profile, isLoading: isProfileLoading } =
    useGetSingleProfileDetailsByCreatorIdQuery(loggedInUserId);

  return (
    <>
      {isProfileLoading && (
        // <div className="w-full h-screen flex items-center justify-center">
        <Loader2 />
        // </div>
      )}
      {profile ? (
        <>
          {!showProfileEditForm && (
            <div className="lg:mx-10">
              <div className="mt-10 border border-primary-border rounded-md">
                <div className="bg-primary-border rounded-tr-md rounded-tl-md h-40"></div>
                <div className="relative w-40 h-40 rounded-full -mt-20 sm:ml-7 ml-2">
                  <Image
                    fill
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile.logo}`}
                    alt={profile.name}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="lg:px-7 sm:px-4 px-2 pt-6 pb-4 flex justify-between">
                  <div>
                    <h1 className="md:text-2xl text-xl font-semibold">
                      {profile.name}
                    </h1>
                    <div className="text-gray-600 flex items-center gap-2">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-map-pin-plus"
                        >
                          <path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738" />
                          <circle cx="12" cy="10" r="3" />
                          <path d="M16 18h6" />
                          <path d="M19 15v6" />
                        </svg>
                      </span>{" "}
                      <span>{address}</span>
                    </div>
                  </div>
                  <button
                    className="flex gap-2 bg-custom-blue rounded-md hover:bg-hover-blue text-white px-3 py-2 h-fit"
                    onClick={setShowEditProfileForm}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-user-pen sm:w-5 sm:h-5 w-[17px] h-[17px]"
                      >
                        <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
                        <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                        <circle cx="10" cy="7" r="4" />
                      </svg>
                    </span>
                    <span className="lg:block hidden">Edit Profile</span>
                  </button>
                </div>
              </div>
              <div className="border-primary-border border  lg:px-7 sm:px-4 px-2 my-10 py-4 rounded-md min-h-40">
                <h1 className="text-2xl font-semibold">Company Description</h1>
                <p className="text-justify pt-3 text-gray-600">
                  {profile.description}
                </p>
              </div>
            </div>
          )}
          {showProfileEditForm && (
            <div className="bg-white py-6 mt-10 rounded-md ">
              <div className="flex items-center">
                <button
                  className="bg-gray-200 rounded-full ml-4 px-1.5 py-1.5"
                  onClick={setShowEditProfileForm}
                >
                  <ArrowLeft className="text-white w-6 h-6" />
                </button>
                <h1 className="text-3xl xl:text-start text-center font-semibold primary-text py-4 w-full  pl-14 max-w-screen-lg  mx-auto">
                  Edit Profile{" "}
                </h1>
              </div>
              <div className="pt-6 border-[#0F5288] border-t-2">
                <ProfileForm
                  type="updateProfile"
                  profileId={profile._id}
                  setShowEditProfileForm={setShowEditProfileForm}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="bg-white py-6 mt-10 rounded-md ">
            <h1 className="text-3xl font-semibold primary-text py-4 w-full  pl-6 max-w-screen-lg mx-auto">
              Create Profile{" "}
            </h1>
            <div className="pt-6 border-[#0F5288] border-t-2">
              <ProfileForm type="createProfile" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfilePage;
