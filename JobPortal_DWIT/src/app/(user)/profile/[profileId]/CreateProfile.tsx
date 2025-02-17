"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import "react-datepicker/dist/react-datepicker.css";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import UserProfileForm from "@/components/user/forms/UserProfile";

import { useGetSingleProfileDetailsByCreatorIdQuery } from "@/lib/store/features/profileApi";
import { CircleAlert, Mail, Phone } from "lucide-react";

const ProfileCreatePage = ({ params }: { params: { profileId: string } }) => {
  const router = useRouter();
  const { profileId } = params;
  const { loggedInUserId, role } = useSelector(
    (state: RootState) => state.authenticated
  );
  const { data: profile, isLoading: isProfileLoading } =
    useGetSingleProfileDetailsByCreatorIdQuery(profileId, {
      skip: !profileId,
    });
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    if (profile?.logo) {
      setProfilePicture(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile.logo}`
      );
    }
  }, [profile]);

  if (!loggedInUserId) {
    router.push("/");
    return;
  }
  return (
    <section className="bg-gray-100 pt-6 font-arial-rounded-regular">
      {/*
       showing this message if no profile, but only for admin and company,
       if there is no profile and user tries to create profile and navigates to this page then user also sees this message instead of create profile form below,
       so conditionally checking role here
       */}
      {!isProfileLoading &&
        !profile &&
        (role === "admin" || role === "company") && (
          <div className="flex items-center justify-center h-screen">
            <p className="font-switzer-regular font-semibold text-4xl text-gray-400">
              <CircleAlert className="w-16 h-16 mx-auto mb-4" />
              No Profile Available
            </p>
          </div>
        )}

      {/*
       for employees, if profile is created then profile is shown here,
      if certain fields are not filled by employees then conditionally rendering the fallback message
      */}
      {!isProfileLoading && loggedInUserId && profile && (
        <div className="layout-container  mx-auto px-4 md:py-10 py-6 md:space-y-10 space-y-7">
          <div className=" border border-primary-border rounded-md bg-white">
            <div className="bg-primary-border rounded-tr-md rounded-tl-md md:h-40 h-32"></div>
            <div className="relative w-40 h-40 rounded-full -mt-20 sm:ml-7 ml-2">
              <Image
                fill
                src={profilePicture}
                alt={profile.name}
                className="object-cover rounded-full"
                onError={() => setProfilePicture("/images/profilepicture.png")}
              />
            </div>
            <div className="flex justify-between my-6 px-9 ">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold">{profile.name}</h1>
                <span className="bg-primary-border rounded-md px-2 py-0.5 text-sm">
                  public
                </span>
              </div>
              {role === "employee" && (
                <Link
                  href="/profile/edit"
                  className="flex gap-2 bg-custom-blue rounded-md hover:bg-hover-blue text-white text-sm px-3 py-2 h-fit"
                  // onClick={() => setShowEditProfileForm((prev) => !prev)}
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
                </Link>
              )}
            </div>
          </div>

          {/* personal information section */}
          <div className="border border-primary-border rounded-md p-6 bg-white w-full">
            <h1 className="text-xl font-semibold">Personal Information</h1>
            <div className="md:max-w-[50rem] w-full grid sm:grid-cols-2 place-items-between">
              <div className="flex items-center gap-2 sm:py-6 py-4 sm:justify-self-start">
                <span className="bg-primary-border rounded-md p-1.5">
                  <Mail className="w-5 h-5 text-white" />
                </span>
                <div className="font-medium">
                  <h2 className="text-sm text-gray-500">Email</h2>
                  {profile.email}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:py-6 py-4 md:justify-self-start sm:justify-self-end">
                <span className="bg-primary-border rounded-md p-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map-pin-plus text-white"
                  >
                    <path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M16 18h6" />
                    <path d="M19 15v6" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-sm text-gray-500">Location</h2>
                  {profile.location ? profile.location : "Not Available"}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:py-6 py-4 sm:justify-self-start">
                <span className="bg-primary-border rounded-md p-1.5">
                  <Phone className="w-5 h-5 text-white" />
                </span>
                <div>
                  <h2 className="text-sm text-gray-500">Phone number</h2>
                  {profile.phone_number
                    ? profile.phone_number
                    : "Not Available"}
                </div>
              </div>
            </div>
          </div>

          {/* about yourself */}
          <div className="border border-primary-border rounded-md p-6 bg-white">
            <h1 className="text-xl font-semibold">About yourself</h1>
            <p className="text-sm text-justify tracking-wide text-gray-500 pt-4">
              {profile.description
                ? profile.description
                : "Writing a bio on your profile for job seekers requires a slightly different approach than a traditional resume bio. You need a good introduction, a few lines to highlight your core skills and areas of expertise. Share some of your key accomplishments or projects that demonstrate your value as a professional."}
            </p>
          </div>

          {/*  */}
          <div className="border border-primary-border rounded-md p-6 bg-white">
            <h1 className="text-xl font-semibold">Experience</h1>
            {JSON.parse(profile.experience)[0].job_title === "" ? (
              <p className="text-sm tracking-wide text-gray-500 pt-4">
                {role === "employee"
                  ? "Outline your employment particulars encompassing both your present role and past professional experiences with previous companies."
                  : "Not Available."}
              </p>
            ) : (
              <ul className="space-y-4 divide-y-2">
                {JSON.parse(profile.experience).map((experience: any) => (
                  <>
                    <div className="pt-4">
                      <div className="flex gap-4 items-center">
                        <h1 className="text-lg font-semibold">
                          {experience.job_title}
                        </h1>
                        {experience.job_type && (
                          <span className="bg-primary-border rounded-md px-2 h-6 content-center text-[0.75rem]">
                            {experience.job_type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 pb-2">
                        {experience.job_location}
                      </p>
                      <li className="">{experience.previous_organization}</li>
                      {experience.join_date && (
                        <div className="flex gap-4 text-sm text-gray-500 pt-3">
                          <li className="tracking-wider">
                            {experience.join_date.split("T")[0]}
                          </li>
                          <li> - </li>
                          <li className="tracking-wider">
                            {experience.end_date
                              ? experience.end_date.split("T")[0]
                              : "Present"}
                          </li>
                        </div>
                      )}
                    </div>
                  </>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-primary-border rounded-md p-6 bg-white">
            <h1 className="text-xl font-semibold">Education</h1>
            {JSON.parse(profile.education)[0].degree_title === "" ? (
              <p className="text-sm tracking-wide text-gray-500 pt-4">
                {role === "employee"
                  ? "Kindly provide information about your educational background, including details about your schooling, college attendance, and degrees earned. This will enhance the robustness of your profile."
                  : "Not Available."}
              </p>
            ) : (
              <ul className="space-y-4 divide-y-2">
                {JSON.parse(profile.education).map((education: any) => (
                  <>
                    <div className="pt-4">
                      <div className="flex gap-4 items-center">
                        <h1 className="text-lg font-semibold">
                          {education.college_name}
                        </h1>
                        <span className="bg-primary-border rounded-md px-2 h-6 content-center text-[0.75rem]">
                          {education.degree_type}
                        </span>
                      </div>
                      <li className="text-sm">{education.degree_title}</li>
                      {education.join_date && (
                        <div className="flex gap-4 text-sm text-gray-500 pt-3">
                          <li className="tracking-wider">
                            {education.join_date.split("T")[0]}
                          </li>
                          <li> - </li>
                          <li className="tracking-wider">
                            {education.end_date
                              ? education.end_date.split("T")[0]
                              : "Present"}
                          </li>
                        </div>
                      )}
                    </div>
                  </>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-primary-border rounded-md p-6 bg-white">
            <h1 className="text-xl font-semibold">Social Medial Links</h1>
            {JSON.parse(profile.socialMediaLinks)[0].type === "" ? (
              <p className="text-sm tracking-wide text-gray-500 pt-4">
                {role === "employee"
                  ? "Include your social media links to increase your reach."
                  : "Not Available."}
              </p>
            ) : (
              <ul className="flex gap-4 mt-4 flex-wrap">
                {JSON.parse(profile.socialMediaLinks).map(
                  (socialMediaLink: any) => (
                    <>
                      <div className="">
                        <h3 className="capitalize font-semibold pb-1">
                          {socialMediaLink.type}
                        </h3>
                        <Link
                          className="bg-gray-200 rounded-xl px-2 py-1"
                          href={socialMediaLink.url}
                          target="_blank"
                        >
                          {socialMediaLink.url.slice(0, 30) + "..."}
                        </Link>
                      </div>
                    </>
                  )
                )}
              </ul>
            )}
          </div>
          <div className="border border-primary-border rounded-md p-6 bg-white">
            <h1 className="text-xl font-semibold">Project Profile</h1>
            {JSON.parse(profile.project_profile)[0].project_title === "" ? (
              <p className="text-sm tracking-wide text-gray-500 pt-4">
                {role === "employee"
                  ? "Include information about the projects you&apos;ve worked on while in college, during internships, or in your professional roles. This will add depth to your profile."
                  : "Not Available."}
              </p>
            ) : (
              <ul className="space-y-4 divide-y-2">
                {JSON.parse(profile.project_profile).map(
                  (project_profile: any) => (
                    <>
                      <div className="pt-4">
                        <div className="flex gap-4 items-center">
                          <h1 className="text-lg font-semibold">
                            {project_profile.project_title}
                          </h1>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={project_profile.project_link}
                            className="text-sm flex gap-1 bg-gray-200 rounded-xl px-3 py-1 w-fit items-center"
                          >
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-link"
                              >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                            </span>{" "}
                            Show project
                          </a>
                        </div>

                        {project_profile.project_start_date && (
                          <div className="flex gap-4 text-sm text-gray-500 pt-3">
                            <li className="tracking-wider">
                              {project_profile.project_start_date.split("T")[0]}
                            </li>
                            <li> - </li>
                            <li className="tracking-wider">
                              {project_profile.end_date
                                ? project_profile.project_end_date.split("T")[0]
                                : "Present"}
                            </li>
                          </div>
                        )}
                      </div>
                    </>
                  )
                )}
              </ul>
            )}
          </div>
          <div className="border border-primary-border rounded-md p-6 bg-white">
            <h1 className="text-xl font-semibold">Language</h1>
            {!profile?.language ? (
              <p className="text-sm tracking-wide text-gray-500 pt-4">
                {role === "employee"
                  ? "Include information about language that you are good at"
                  : "Not Available"}
              </p>
            ) : (
              <ul className="flex gap-3 mt-4 flex-wrap">
                {profile.language.split(",").map((language: string) => (
                  <li
                    key={language}
                    className="bg-gray-200 rounded-2xl px-3 py-1 capitalize"
                  >
                    {language.trim()}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border border-primary-border rounded-md p-6 bg-white">
            <h1 className="text-xl font-semibold">Skills</h1>
            {!profile?.skills ? (
              <p className="text-sm tracking-wide text-gray-500 pt-4">
                {role === "employee"
                  ? "Share your expertise or notable skills with recruiters, such as Direct Marketing, Oracle, Java, etc. This will enable us to provide you with job opportunities tailored to your skill set."
                  : "Not Available"}
              </p>
            ) : (
              <ul className="flex gap-3 mt-4 flex-wrap">
                {profile.skills.split(",").map((skill: string) => (
                  <li
                    key={skill}
                    className="bg-gray-200 rounded-2xl px-3 py-1 capitalize"
                  >
                    {skill.trim()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* profile creating form for employees */}
      {!isProfileLoading &&
        loggedInUserId &&
        !profile &&
        role === "employee" && (
          <section className="bg-white shadow-lg max-w-screen-lg mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Create Profile</h1>
            <UserProfileForm type="createProfile" />
          </section>
        )}
    </section>
  );
};

export default ProfileCreatePage;
