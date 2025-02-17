"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Company } from "@/lib/types";
import Input from "@/components/ui/Input";
import { toast } from "react-toastify";
import {
  useCreateCompanyMutation,
  useGetSingleCompanyDetailsQuery,
  useUpdateCompanyMutation,
} from "@/lib/store/features/companyApi";
import { useDropzone, DropzoneState } from "react-dropzone";
import Image from "next/image";
import FormSubmitButton from "@/components/ui/FormSubmitButton";

interface CompanyFormProps {
  type: string;
  companyId?: string;
}

const CompanyForm = ({ type, companyId }: CompanyFormProps) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageTypeError, setImageTypeError] = useState<string>("");

  const [
    createCompany,
    { isLoading: isCreateCompanyLoading, isSuccess: isCreateCompanySuccess },
  ] = useCreateCompanyMutation();

  const { data: company, isSuccess: isSingleCompanyDetailsSuccess } =
    useGetSingleCompanyDetailsQuery(companyId, {
      skip: type !== "updateCompany",
    });

  const [
    updateCompany,
    { isLoading: isUpdateCompanyLoading, isSuccess: isUpdateCompanySuccess },
  ] = useUpdateCompanyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm<Company>({
    defaultValues: {
      company: "",
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
          setTimeout(() => {
            setImageTypeError("");
          }, 3000);
          return;
        }
        setValue("logo", file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [setValue]
  );

  const dropzoneOptions: any = {
    onDrop,
    // accept: "image/jpeg,image/jpg,image/png,image/gif",
    multiple: false,
  };

  const { getRootProps, getInputProps }: DropzoneState =
    useDropzone(dropzoneOptions);

  //company create handler
  const onSubmit: SubmitHandler<Company> = async (companyDetails) => {
    try {
      // Check if logo is provided
      if (!companyDetails.logo) {
        setError("logo", { type: "manual", message: "Logo is required." });
        setTimeout(() => {
          setError("logo", { type: "manual", message: "" });
        }, 3000);
        return;
      }

      const formData = new FormData();
      formData.set("company", companyDetails.company);
      formData.set("description", companyDetails.description);

      // Check if companyDetails.logo is a File object
      if (companyDetails.logo instanceof File) {
        formData.append("image", companyDetails.logo);
      } else if (
        type === "updateCompany" &&
        typeof companyDetails.logo === "string"
      ) {
        // Handle existing image URL for update case
        formData.set("logo", companyDetails.logo);
      }

      if (type === "createCompany") {
        await createCompany(formData).unwrap();

        toast.success("Company created successfully.");
      }
      if (type === "updateCompany") {
        await updateCompany({ companyId, formData });

        toast.success("Company updated successfully");
      }
      router.push("/admin/view/company");
    } catch (error: any) {
      toast.warn(error?.data?.message);
      console.log("COMPANY_CREATE_ERROR", error);
    }
  };

  //setting the companies values to the input fields for update case
  useEffect(() => {
    if (type === "updateCompany" && isSingleCompanyDetailsSuccess && company) {
      reset(company);
    }
  }, [type, isSingleCompanyDetailsSuccess, company, reset]);

  return (
    <>
      <form
        className="px-4 space-y-4 w-full max-w-large mx-auto min-h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("company", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Company cannot be empty or whitespace",
          })}
          error={errors.company?.message}
          id="company"
          type="text"
          label="Company"
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
          label="Company Description"
        />
        <div
          {...getRootProps({
            className: "dropzone",
            // onClick: () => {
            //   document.getElementById("dropzone")?.click();
            // },
          })}
          className="border-2 border-dashed border-gray-400 p-4 rounded-md cursor-pointer"
        >
          <input id="dropzone" {...getInputProps()} {...register("logo")} />
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/dropzone.jpg"
              width={80}
              height={80}
              alt="dropzone-pic"
            />
            {imageTypeError ? (
              <p className="text-red-600 text-sm mt-2">{imageTypeError}</p>
            ) : (
              <span className="text-gray-400 text-sm mt-2">
                Drag n drop company logo here, or click to select one
              </span>
            )}
            {errors.logo && (
              <p className="text-red-600 text-sm mt-2">{errors.logo.message}</p>
            )}
          </div>
        </div>
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
        {!preview && company && company.logo && (
          <div className="mt-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company.logo}`}
              alt="Image Preview"
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateCompanyLoading || isUpdateCompanyLoading}
            isCreateMode={type === "createCompany"}
          />
        </div>
      </form>
    </>
  );
};

export default CompanyForm;
