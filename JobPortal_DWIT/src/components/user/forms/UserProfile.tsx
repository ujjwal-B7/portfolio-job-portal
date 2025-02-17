"use client";
import Image from "next/image";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import React, { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import Input from "@/components/ui/Input";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

import {
  useCreateProfileByUsersMutation,
  useUpdateProfileByUsersMutation,
  useGetSingleProfileDetailsByCreatorIdQuery,
} from "@/lib/store/features/profileApi";
import { toast } from "react-toastify";

import { UserProfile } from "@/lib/types";

import { Camera, CirclePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
interface UserProfileFormProps {
  type: string;
}

const UserProfileForm = ({ type }: UserProfileFormProps) => {
  const router = useRouter();
  const { name, email, loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  const profilePictureUploadRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string>("");

  const [createProfileByUsers, { isLoading: isCreateProfileByUsersLoading }] =
    useCreateProfileByUsersMutation();

  const [
    updateProfileByUsers,
    { isLoading: isUpdateProfileByUsersLoading, isError, error },
  ] = useUpdateProfileByUsersMutation();

  const {
    data: profile,
    isSuccess: isProfileDetailsSuccess,
    isLoading: isProfileLoading,
  } = useGetSingleProfileDetailsByCreatorIdQuery(loggedInUserId, {
    skip: type !== "editProfile",
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserProfile>({
    defaultValues: {
      name: name,
      email: email,
      phone_number: "",
      about_yourself: "",
      profile_picture: "",
      location: "",
      experience: [
        {
          job_title: "",
          previous_organization: "",
          job_type: "", // intern, full time
          job_location: "",
          join_date: "",
          end_date: "",
        },
      ],
      education: [
        {
          degree_title: "", // bachelors in It
          degree_type: "", // bachelor, phd
          college_name: "",
          join_date: "",
          end_date: "",
        },
      ],
      skills: "",
      project_profile: [
        {
          project_title: "",
          project_link: "",
          project_description: "",
          project_start_date: "",
          project_end_date: "",
        },
      ],
      language: "",
      socialMediaLinks: [
        {
          type: "", //facebook instagram
          url: "",
        },
      ],
    },
  });

  // Handle dynamic fields for experience
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  // Handle dynamic fields for education
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  // Handle dynamic fields for projects
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "project_profile",
  });

  // Handle dynamic fields for social media links
  const {
    fields: socialMediaFields,
    append: appendSocialMedia,
    remove: removeSocialMedia,
  } = useFieldArray({
    control,
    name: "socialMediaLinks",
  });

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
    try {
      const formData = new FormData();
      formData.set("name", data.name!); // data.name!, ! ensures that data.name is not null
      formData.set("email", data.email!);
      formData.set("phone_number", data.phone_number);
      formData.set("description", data.about_yourself);
      // Check if profile_picture is a FileList and extract the File
      if (data.profile_picture instanceof File) {
        formData.append("profile_picture", data.profile_picture);
      } else if (
        type === "editProfile" &&
        typeof data.project_profile === "string"
      ) {
        formData.set("profile_picture", data.profile_picture);
      }
      formData.set("location", data.location);
      formData.set("experience", JSON.stringify(data.experience));
      formData.set("education", JSON.stringify(data.education));
      formData.set("skills", data.skills);
      formData.set("project_profile", JSON.stringify(data.project_profile));
      formData.set("language", data.language);
      formData.set("socialMediaLinks", JSON.stringify(data.socialMediaLinks));

      if (type === "createProfile") {
        await createProfileByUsers(formData).unwrap();

        toast.success("Profile created successfully.");
      }

      if (type === "editProfile") {
        const profileId = profile._id;

        await updateProfileByUsers({ formData, profileId }).unwrap();
        toast.success("Profile updated successfully.");
        router.push("/profile");
      }
    } catch (error) {
      console.log("USER_PROFILE_CREATING_ERROR", error);
    }
  };

  useEffect(() => {
    if (type === "editProfile" && isProfileDetailsSuccess && profile) {
      reset({
        phone_number: profile.phone_number,
        about_yourself: profile.description,
        location: profile.location,
        experience: JSON.parse(profile.experience),
        education: JSON.parse(profile.education),
        skills: profile.skills,
        project_profile: JSON.parse(profile.project_profile),
        language: profile.language,
        socialMediaLinks: JSON.parse(profile.socialMediaLinks),
      });

      setSelectedImage(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile.logo}`
      );
    }
  }, [reset, type, isProfileDetailsSuccess, profile]);

  if (!loggedInUserId) {
    router.push("/");
    return;
  }

  return (
    <>
      {type === "editProfile" && isProfileLoading && <div>Loading...</div>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-md p-4 font-switzer-regular"
      >
        <div className="">
          <label htmlFor="company_pan_image" className="text-4 mb-1">
            Upload Profile Picture
          </label>
          <div
            className="w-40 h-40 rounded-md flex items-center justify-center cursor-pointer"
            onClick={() => profilePictureUploadRef.current?.click()}
          >
            <div className="relative w-40 h-40 rounded-full mt-2">
              <Image
                src={selectedImage}
                fill
                alt="preview-image"
                className="rounded-full object-cover"
                onError={() => setSelectedImage("/images/profilepicture.png")}
              />
              <div className="absolute right-6 bottom-4 z-50">
                <Camera className="text-[#36312F] bg-hover-light rounded-full p-2 w-10 h-10" />
              </div>
            </div>
          </div>

          <input
            {...register("profile_picture")}
            id="profile_picture"
            type="file"
            ref={profilePictureUploadRef}
            className="hidden"
            onChange={(e) => {
              const file: any = e.target.files?.[0];
              setSelectedImage(URL.createObjectURL(file));
              setValue("profile_picture", file);
            }}
          />
        </div>

        <div className="flex sm:flex-row flex-col sm:gap-6 gap-5">
          <div className="sm:w-1/2">
            <Input
              {...register("name", {
                required: "Required.",
              })}
              error={errors.name?.message}
              id="name"
              type="text"
              label="Name"
              readOnly
            />
          </div>
          <div className="sm:w-1/2">
            <Input
              {...register("email", { required: "Required." })}
              error={errors.email?.message}
              id="email"
              type="text"
              label="Email"
              readOnly
            />
          </div>
        </div>
        <div className="flex sm:flex-row flex-col sm:gap-6 gap-5">
          <div className="sm:w-1/2 sm:space-y-6 space-y-5">
            <Input
              {...register("phone_number", {})}
              error={errors.phone_number?.message}
              id="phone_number"
              type="text"
              label="Phone Number"
            />
            <Input
              {...register("location", {})}
              error={errors.location?.message}
              id="location"
              type="text"
              label="Location"
            />
          </div>
          <div className="sm:w-1/2">
            <Input
              {...register("about_yourself", {})}
              error={errors.about_yourself?.message}
              id="about_yourself"
              type="textarea"
              height="10rem"
              label="About yourself"
            />
          </div>
        </div>
        <div className="flex sm:flex-row flex-col sm:gap-6 gap-5">
          <div className="sm:w-1/2">
            <Input
              {...register("skills", {})}
              error={errors.skills?.message}
              id="skills"
              type="text"
              label="Skills ( Skill1,Skill2, ... )"
            />
          </div>
          <div className="sm:w-1/2">
            <Input
              {...register("language", {})}
              error={errors.language?.message}
              id="language"
              type="text"
              label="Language"
            />
          </div>
        </div>

        {/* Experience Fields */}
        <div className="border border-gray-200 rounded-md p-4">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          <div className="divide-y-2">
            {experienceFields.map((item, index) => (
              <>
                <div key={item.id} className="space-y-4 pt-4">
                  <div className="flex sm:flex-row flex-col sm:gap-6 gap-5">
                    <div className="sm:w-1/2">
                      <Input
                        {...register(`experience.${index}.job_title`)}
                        id={`experience.${index}.job_title`}
                        type="text"
                        label="Job Title"
                      />
                    </div>
                    <div className="sm:w-1/2">
                      <Input
                        {...register(
                          `experience.${index}.previous_organization`
                        )}
                        id={`experience.${index}.previous_organization`}
                        type="text"
                        label="Previous Organization"
                      />
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col sm:gap-6 gap-5">
                    <div className="sm:w-1/2">
                      <Input
                        {...register(`experience.${index}.job_type`)}
                        id={`experience.${index}.job_type`}
                        type="text"
                        label="Job Type"
                      />
                    </div>
                    <div className="sm:w-1/2">
                      <Input
                        {...register(`experience.${index}.job_location`)}
                        id={`experience.${index}.job_location`}
                        type="text"
                        label="Job Location"
                      />
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col sm:gap-4 gap-5">
                    <div className="space-y-0.5 sm:w-1/2 ">
                      <label className="block font-medium">Join Date:</label>
                      <Controller
                        control={control}
                        name={`experience.${index}.join_date`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date) => onChange(date)}
                            onBlur={onBlur}
                            showIcon
                            icon={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-calendar-days mt-0.5"
                              >
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect
                                  width="18"
                                  height="18"
                                  x="3"
                                  y="4"
                                  rx="2"
                                />
                                <path d="M3 10h18" />
                                <path d="M8 14h.01" />
                                <path d="M12 14h.01" />
                                <path d="M16 14h.01" />
                                <path d="M8 18h.01" />
                                <path d="M12 18h.01" />
                                <path d="M16 18h.01" />
                              </svg>
                            }
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Join Date"
                            className="p-2 border border-gray-300 rounded "
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="block font-medium">End Date:</label>

                      <Controller
                        control={control}
                        name={`experience.${index}.end_date`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date) => onChange(date)}
                            onBlur={onBlur}
                            showIcon
                            icon={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-calendar-days mt-0.5"
                              >
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect
                                  width="18"
                                  height="18"
                                  x="3"
                                  y="4"
                                  rx="2"
                                />
                                <path d="M3 10h18" />
                                <path d="M8 14h.01" />
                                <path d="M12 14h.01" />
                                <path d="M16 14h.01" />
                                <path d="M8 18h.01" />
                                <path d="M12 18h.01" />
                                <path d="M16 18h.01" />
                              </svg>
                            }
                            dateFormat="yyyy/MM/dd"
                            placeholderText="End Date"
                            className="p-2 border border-gray-300 rounded"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="text-end">
                    {experienceFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="text-danger hover:text-danger/80 w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ))}

            {errors.experience && (
              <p className="text-danger text-sm py-2">
                {errors.experience.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              clearErrors("experience");
              const experienceFields = watch("experience");

              const lastExperience =
                experienceFields[experienceFields.length - 1];
              const {
                job_title,
                previous_organization,
                job_type,
                job_location,
                join_date,
                end_date,
              } = lastExperience;

              if (
                !job_title &&
                !previous_organization &&
                !job_type &&
                !job_location &&
                !join_date &&
                !end_date
              ) {
                setError("experience", {
                  type: "manual",
                  message:
                    "Please fill in at least one field before adding another experience.",
                });
                setTimeout(() => {
                  clearErrors("experience");
                }, 4000);
              } else {
                clearErrors("experience");
                appendExperience({
                  job_title: "",
                  previous_organization: "",
                  job_type: "",
                  job_location: "",
                  join_date: "",
                  end_date: "",
                });
              }
            }}
            className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md flex gap-2 items-center text-sm "
          >
            <CirclePlus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Education Fields */}
        <div className="border border-gray-200 rounded-md p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
          </div>
          <div className="divide-y-2">
            {educationFields.map((item, index) => (
              <div key={item.id} className="space-y-4 pt-4">
                <div className="flex sm:flex-row flex-col sm:gap-6 gap-5">
                  <div className="sm:w-1/2">
                    <Input
                      {...register(`education.${index}.degree_title`)}
                      id={`education.${index}.degree_title`}
                      type="text"
                      label="Degree Title"
                    />
                  </div>
                  <div className="sm:w-1/2">
                    <Input
                      {...register(`education.${index}.degree_type`)}
                      id={`education.${index}.degree_type`}
                      type="text"
                      label="Degree Type"
                    />
                  </div>
                </div>

                <Input
                  {...register(`education.${index}.college_name`)}
                  id={`education.${index}.college_name`}
                  type="text"
                  label="College Name"
                />

                <div className="flex sm:flex-row flex-col sm:gap-4 gap-5">
                  <div className="space-y-0.5 sm:w-1/2">
                    <label className="block font-medium">Join Date:</label>

                    <Controller
                      control={control}
                      name={`education.${index}.join_date`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                          selected={value ? new Date(value) : null}
                          onChange={(date) => onChange(date)}
                          onBlur={onBlur}
                          showIcon
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-calendar-days mt-0.5"
                            >
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect width="18" height="18" x="3" y="4" rx="2" />
                              <path d="M3 10h18" />
                              <path d="M8 14h.01" />
                              <path d="M12 14h.01" />
                              <path d="M16 14h.01" />
                              <path d="M8 18h.01" />
                              <path d="M12 18h.01" />
                              <path d="M16 18h.01" />
                            </svg>
                          }
                          dateFormat="yyyy/MM/dd"
                          placeholderText="End Date"
                          className="p-2 border border-gray-300 rounded"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="block font-medium">End Date:</label>
                    <Controller
                      control={control}
                      name={`education.${index}.end_date`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                          selected={value ? new Date(value) : null} // Set the selected value from the form state
                          onChange={(date) => onChange(date)} // Manually handle onChange to update the form state
                          onBlur={onBlur}
                          showIcon
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-calendar-days mt-0.5"
                            >
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect width="18" height="18" x="3" y="4" rx="2" />
                              <path d="M3 10h18" />
                              <path d="M8 14h.01" />
                              <path d="M12 14h.01" />
                              <path d="M16 14h.01" />
                              <path d="M8 18h.01" />
                              <path d="M12 18h.01" />
                              <path d="M16 18h.01" />
                            </svg>
                          }
                          dateFormat="yyyy/MM/dd"
                          placeholderText="End Date"
                          className="p-2 border border-gray-300 rounded"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="text-end">
                  {educationFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="text-danger hover:text-danger/80 w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {errors.education && (
              <p className="text-danger text-sm py-2">
                {errors.education.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              clearErrors("education");
              const educationFields = watch("education");

              const lastEducation = educationFields[educationFields.length - 1];
              const {
                degree_title,
                degree_type,
                college_name,
                join_date,
                end_date,
              } = lastEducation;

              if (
                !degree_title &&
                !degree_type &&
                !college_name &&
                !join_date &&
                !end_date
              ) {
                setError("education", {
                  type: "manual",
                  message:
                    "Please fill in at least one field before adding another education.",
                });
                setTimeout(() => {
                  clearErrors("education");
                }, 4000);
              } else {
                clearErrors("education");
                appendEducation({
                  degree_title: "",
                  degree_type: "",
                  college_name: "",
                  join_date: "",
                  end_date: "",
                });
              }
            }}
            className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md flex gap-2 items-center text-sm"
          >
            <CirclePlus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Project Fields */}
        <div className="border border-gray-200 rounded-md p-4">
          <h2 className="text-xl font-semibold">Projects</h2>

          <div className="divide-y-2">
            {projectFields.map((item, index) => (
              <div key={item.id} className="space-y-4 pt-4">
                <div className="flex sm:flex-row flex-col sm:gap-6 gap-5">
                  <div className="sm:w-1/2 sm:space-y-4 space-y-5">
                    <Input
                      {...register(`project_profile.${index}.project_title`)}
                      id={`project_profile.${index}.project_title`}
                      type="text"
                      label="Project Title"
                    />
                    <Input
                      {...register(`project_profile.${index}.project_link`, {
                        required: false,
                        pattern: {
                          value:
                            /^(https?:\/\/)?([\w\d\-]+\.)+[\w\d\-]+(\/[\w\d\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                          message: "Url should start with http or https",
                        },
                      })}
                      error={
                        errors.project_profile?.[index]?.project_link &&
                        errors?.project_profile[index]?.project_link.message
                      }
                      id={`project_profile.${index}.project_link`}
                      type="text"
                      label="Project link"
                    />
                  </div>
                  <div className="sm:w-1/2">
                    <Input
                      {...register(
                        `project_profile.${index}.project_description`
                      )}
                      id={`project_profile.${index}.project_description`}
                      height="8.2rem"
                      type="textarea"
                      label="Project description"
                    />
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col sm:gap-4 gap-5">
                  <div className="space-y-0.5 sm:w-1/2">
                    <label className="block font-medium">Join Date:</label>
                    <Controller
                      control={control}
                      name={`project_profile.${index}.project_start_date`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                          selected={value ? new Date(value) : null} // Set the selected value from the form state
                          onChange={(date) => onChange(date)} // Manually handle onChange to update the form state
                          onBlur={onBlur}
                          showIcon
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-calendar-days mt-0.5"
                            >
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect width="18" height="18" x="3" y="4" rx="2" />
                              <path d="M3 10h18" />
                              <path d="M8 14h.01" />
                              <path d="M12 14h.01" />
                              <path d="M16 14h.01" />
                              <path d="M8 18h.01" />
                              <path d="M12 18h.01" />
                              <path d="M16 18h.01" />
                            </svg>
                          }
                          dateFormat="yyyy/MM/dd"
                          placeholderText="End Date"
                          className="p-2 border border-gray-300 rounded"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="block font-medium">End Date:</label>
                    <Controller
                      control={control}
                      name={`project_profile.${index}.project_end_date`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                          selected={value ? new Date(value) : null} // Set the selected value from the form state
                          onChange={(date) => onChange(date)} // Manually handle onChange to update the form state
                          onBlur={onBlur}
                          showIcon
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-calendar-days mt-0.5"
                            >
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect width="18" height="18" x="3" y="4" rx="2" />
                              <path d="M3 10h18" />
                              <path d="M8 14h.01" />
                              <path d="M12 14h.01" />
                              <path d="M16 14h.01" />
                              <path d="M8 18h.01" />
                              <path d="M12 18h.01" />
                              <path d="M16 18h.01" />
                            </svg>
                          }
                          dateFormat="yyyy/MM/dd"
                          placeholderText="End Date"
                          className="p-2 border border-gray-300 rounded"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="text-end">
                  {projectFields.length > 1 && (
                    <button type="button" onClick={() => removeProject(index)}>
                      <Trash2 className="text-danger hover:text-danger/80 w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {errors.project_profile && (
              <p className="text-danger text-sm py-2">
                {errors.project_profile.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              clearErrors("project_profile");
              const projectFields = watch("project_profile");

              const lastProject = projectFields[projectFields.length - 1];
              const {
                project_title,
                project_link,
                project_description,
                project_start_date,
                project_end_date,
              } = lastProject;

              if (
                !project_title &&
                !project_link &&
                !project_description &&
                !project_start_date &&
                !project_end_date
              ) {
                setError("project_profile", {
                  type: "manual",
                  message:
                    "Please fill in at least one field before adding another project.",
                });
                setTimeout(() => {
                  clearErrors("project_profile");
                }, 4000);
              } else {
                clearErrors("project_profile");
                appendProject({
                  project_title: "",
                  project_link: "",
                  project_description: "",
                  project_start_date: "",
                  project_end_date: "",
                });
              }
            }}
            className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md flex gap-2 items-center text-sm"
          >
            <CirclePlus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Social Media Links */}
        <div className="border border-gray-200 rounded-md p-4">
          <h2 className="text-xl font-semibold">Social Media Links</h2>

          <div className="divide-y-2">
            {socialMediaFields.map((item, index) => (
              <div key={item.id} className="space-y-4 pt-4 ">
                <div className="flex sm:flex-row flex-col gap-4">
                  <div className="sm:w-1/2">
                    <Input
                      {...register(`socialMediaLinks.${index}.type`)}
                      id={`socialMediaLinks.${index}.type`}
                      type="text"
                      label="Type( Facebook, Instagram, ...)"
                    />
                  </div>
                  <div className="sm:w-1/2">
                    <Input
                      {...register(`socialMediaLinks.${index}.url`)}
                      id={`socialMediaLinks.${index}.url`}
                      type="text"
                      label="URL"
                    />
                  </div>
                </div>

                <div className="text-end">
                  {socialMediaFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialMedia(index)}
                    >
                      <Trash2 className="text-danger hover:text-danger/80 w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {errors.socialMediaLinks && (
              <p className="text-danger text-sm py-2">
                {errors.socialMediaLinks.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              clearErrors("socialMediaLinks");
              const socialMediaFields = watch("socialMediaLinks");

              const lastSocialMedia =
                socialMediaFields[socialMediaFields.length - 1];
              const { type, url } = lastSocialMedia;

              if (!type && !url) {
                setError("socialMediaLinks", {
                  type: "manual",
                  message:
                    "Please fill in at least one field before adding another social media.",
                });
                setTimeout(() => {
                  clearErrors("socialMediaLinks");
                }, 4000);
              } else {
                clearErrors("socialMediaLinks");
                appendSocialMedia({
                  type: "",
                  url: "",
                });
              }
            }}
            className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md flex gap-2 items-center text-sm"
          >
            <CirclePlus className="w-4 h-4" /> Add
          </button>
        </div>

        <button
          type="submit"
          className="bg-custom-blue hover:bg-hover-blue text-white w-32 h-12 flex items-center justify-center rounded-md ml-auto font-semibold tracking-wide"
        >
          {isCreateProfileByUsersLoading ? (
            <span className="button-loader"></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
};

export default UserProfileForm;
