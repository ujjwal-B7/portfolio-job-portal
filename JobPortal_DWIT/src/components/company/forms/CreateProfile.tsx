import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Profile } from "@/lib/types";
import Input from "@/components/ui/Input";
import { toast } from "react-toastify";
import {
  useCreateProfileMutation,
  useGetSingleProfileDetailsByCreatorIdQuery,
  useUpdateProfileMutation,
} from "@/lib/store/features/profileApi";
import { useDropzone, DropzoneState } from "react-dropzone";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Upload } from "lucide-react";

interface ProfileFormProps {
  type: string;
  profileId?: string;
  setShowEditProfileForm?: () => void;
}

const ProfileForm = ({
  type,
  profileId,
  setShowEditProfileForm,
}: ProfileFormProps) => {
  const loggedInUserData = useSelector(
    (state: RootState) => state.authenticated
  );
  const { loggedInUserId } = loggedInUserData;

  const [preview, setPreview] = useState<string | null>(null);
  const [imageTypeError, setImageTypeError] = useState<string>("");
  const [imageRequiredError, setImageRequiredError] = useState<string>("");

  const [
    createProfile,
    { isLoading: isCreateProfileLoading, isError: isCreateProfileError },
  ] = useCreateProfileMutation();

  const { data: profile, isSuccess: isSingleProfileDetailsSuccess } =
    useGetSingleProfileDetailsByCreatorIdQuery(loggedInUserId, {
      skip: type !== "updateProfile",
    });

  const [
    updateProfile,
    {
      isLoading: isUpdateProfileLoading,
      isError: isUpdateProfileError,
      isSuccess: isUpdateProfileSuccess,
    },
  ] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
    clearErrors,
  } = useForm<Profile>({
    defaultValues: {
      name: "",
      description: "",
      logo: "",
    },
  });

  //react dropzone image drop handler
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const imageType = ["jpg", "jpeg", "png", "gif"];
      if (acceptedFiles.length) {
        const file = acceptedFiles[0];
        const ext = file.path.split(".")[1];
        if (!imageType.includes(ext)) {
          toast.error("Only images are allowed");
          setImageTypeError("Only images are allowed");
          const timeout = setTimeout(() => {
            setImageTypeError("");
          }, 4000);
          return () => clearTimeout(timeout);
        }
        setValue("logo", file);
        setImageRequiredError("");
        setPreview(URL.createObjectURL(file));
      }
    },
    [setValue]
  );

  const dropzoneOptions: any = {
    onDrop,
    accept: "image/jpeg,image/jpg,image/png,image/gif",
    multiple: false,
  };

  const { getRootProps, getInputProps }: DropzoneState =
    useDropzone(dropzoneOptions);

  //profile create handler
  const onSubmit: SubmitHandler<Profile> = async (profileDetails) => {
    try {
      if (profileDetails.logo === "") {
        setImageRequiredError("Required.");
        const timeout = setTimeout(() => {
          setImageRequiredError("");
        }, 4000);
        return () => clearTimeout(timeout);
      }
      const formData = new FormData();
      formData.set("name", profileDetails.name);
      formData.set("description", profileDetails.description);

      // Check if profileDetails.logo is a File object
      if (profileDetails.logo instanceof File) {
        formData.append("image", profileDetails.logo);
      } else if (
        type === "updateProfile" &&
        typeof profileDetails.logo === "string"
      ) {
        // Handle existing image URL for update case
        formData.set("logo", profileDetails.logo);
      }

      if (type === "createProfile") {
        await createProfile(formData).unwrap();
        if (isCreateProfileError) return new Error("Profile creating error");
        toast.success("Profile created successfully.");
      }
      if (type === "updateProfile") {
        // console.log(Object.entries(formData).map((item) => item));

        await updateProfile({ profileId, formData });
        if (isUpdateProfileError) return new Error("Profile updating error");
        toast.success("Profile updated successfully");
      }
      reset();
      setPreview("");

      if (setShowEditProfileForm) setShowEditProfileForm();
      // router.push("/company/profile");
    } catch (error: any) {
      console.log("PROFILE_CREATE_ERROR", error);
    }
  };

  //setting the titles values to the input fields for update case
  useEffect(() => {
    if (type === "updateProfile" && isSingleProfileDetailsSuccess && profile) {
      reset(profile);
    }
  }, [type, isSingleProfileDetailsSuccess, profile, reset]);
  return (
    <>
      <form
        className="px-4 space-y-4 w-full max-w-large mx-auto min-h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("name", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Name cannot be empty or whitespace",
          })}
          error={errors.name?.message}
          id="name"
          type="text"
          label="Name"
        />
        <Input
          {...register("description", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" ||
              "Description cannot be empty or whitespace",
          })}
          error={errors.description?.message}
          id="description"
          type="textarea"
          height="10rem"
          label="Profile Description"
        />
        <div className="flex lg:flex-row flex-col justify-between gap-4">
          <div
            {...getRootProps({
              className: "dropzone",
              onClick: () => {
                document.getElementById("dropzone")?.click();
              },
            })}
            className="border-2 border-dashed border-gray-400 p-2 rounded-md cursor-pointer h-12 flex-1"
          >
            <input id="dropzone" {...getInputProps()} />
            <div className="flex gap-4 items-center justify-center">
              <Upload className="text-custom-blue" />
              <span className="text-gray-400 text-sm">
                Drag n drop profile logo, or click to select one
              </span>
            </div>
          </div>
          <div className="flex justify-end lg:mt-0 mt-4">
            <button
              type="submit"
              className={`bg-custom-blue hover:bg-hover-blue font-bold text-white h-12 sm:w-40 w-full rounded-md flex justify-center items-center gap-2 text-lg 
              ${
                (isCreateProfileLoading || isUpdateProfileLoading) &&
                "cursor-not-allowed"
              }
              `}
              disabled={isCreateProfileLoading || isUpdateProfileLoading}
            >
              {type === "createProfile" ? (
                <>
                  Creat
                  {isCreateProfileLoading ? "ing" : "e"}
                  {isCreateProfileLoading && (
                    <span className="button-loader"></span>
                  )}
                </>
              ) : (
                <>
                  Sav
                  {isUpdateProfileLoading ? "ing" : "e"}
                  {isUpdateProfileLoading && (
                    <span className="button-loader"></span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
        {(imageRequiredError || imageTypeError) && (
          <p className="text-red-600 text-sm">
            {imageRequiredError || imageTypeError}
          </p>
        )}

        {/* for creating profile */}
        {preview && (
          <div className="mt-4">
            <Image
              src={preview}
              alt="Image Preview"
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
          </div>
        )}

        {/* for update profile */}
        {!preview && profile && profile.logo && (
          <div className="mt-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile.logo}`}
              alt="Image Preview"
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
          </div>
        )}
      </form>
    </>
  );
};

export default ProfileForm;
