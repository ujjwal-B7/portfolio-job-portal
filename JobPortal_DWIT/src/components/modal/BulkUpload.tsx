import { useBulkJobUploadMutation } from "@/lib/store/features/jobsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Download } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface BulkUploadProps {
  setBulkUploadPopup: () => void;
  role?: string;
}

const BulkUpload = ({ setBulkUploadPopup, role }: BulkUploadProps) => {
  const [selectBulkUploadFile, setSelectedBulkUploadFile] = useState<
    string | undefined
  >("");
  const [fileErrorMessage, setFileErrorMessage] = useState(false);
  const [bulkUploadJob, { isLoading: isBulkUploadLoading }] =
    useBulkJobUploadMutation();

  // hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
  } = useForm({
    defaultValues: {
      bulk_upload_file: "",
    },
  });

  function clearingTimeoutErrors() {
    const timeout = setTimeout(() => {
      setSelectedBulkUploadFile("");
      setFileErrorMessage(false);
    }, 4000);
    return () => clearTimeout(timeout);
  }

  // checking the validity of selected file
  function handleInputChange(e: any) {
    const fileName = e.target.files?.[0].name;

    // if wrong file uploaded then throwing error if its not csv format
    const isFileExtensionMatched =
      fileName?.split(".").pop().trim().toLowerCase() === "csv";

    // conditionally showing the error message if file extension not matched
    setSelectedBulkUploadFile(
      isFileExtensionMatched ? fileName : "Only csv file format is allowed."
    );

    if (!isFileExtensionMatched) {
      //setting up the error and removing error message after 4 seconds
      setFileErrorMessage(!isFileExtensionMatched);
      clearingTimeoutErrors();
    }
  }

  const onSubmit = async (data: any) => {
    try {
      // checking whether file is empty or not during submission
      if (data.bulk_upload_file === "") {
        setFileErrorMessage(true);
        setSelectedBulkUploadFile("File is required.");
        clearingTimeoutErrors();
        return;
      }

      // sending request
      const formData = new FormData();
      formData.set("bulk_upload_file", data.bulk_upload_file);

      const res = await bulkUploadJob(formData).unwrap();
      reset();
      setBulkUploadPopup();
      toast.success("Bulk upload successful.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Internal server error.");
      setFileErrorMessage(true);
      setSelectedBulkUploadFile(
        error?.data?.message || "Internal server error."
      );
      reset();
      clearingTimeoutErrors();
      console.log("JOBS_BULK_UPLOAD_ERROR", error.data.message);
    }
  };

  // reseting the hook form error after 4 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      clearErrors("bulk_upload_file");
    }, 4000);
    return () => clearTimeout(timeout);
  }, [errors.bulk_upload_file?.message, clearErrors]);

  return (
    <div className="fixed inset-0 z-50 h-screen w-full bg-black/60 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-md shadow-md max-w-[30rem] w-full block sm:p-8 p-6 md:space-y-6 space-y-4"
        data-aos="zoom-in"
      >
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          Bulk upload
        </h1>
        <div>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="bulk_upload_file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p
                  className={`mb-2 text-sm text-center ${
                    fileErrorMessage || errors?.bulk_upload_file
                      ? "text-danger"
                      : selectBulkUploadFile
                      ? "text-custom-blue"
                      : "text-gray-500"
                  }`}
                >
                  <span className="font-semibold">
                    {errors?.bulk_upload_file
                      ? errors?.bulk_upload_file?.message
                      : selectBulkUploadFile
                      ? selectBulkUploadFile
                      : "Upload your file here"}
                  </span>
                </p>
                <p className="text-xs text-gray-500">.csv format</p>
              </div>
              <input
                {...register("bulk_upload_file")}
                id="bulk_upload_file"
                type="file"
                name="bulk_upload_file"
                className="hidden"
                accept=".csv"
                onChange={(e) => {
                  handleInputChange(e);
                  setValue("bulk_upload_file", e.target?.files?.[0] as any);
                }}
              />
            </label>
          </div>
          <Link
            href={`/bulk-upload-sample/${
              role === "admin"
                ? "admin-job-bulk-upload-sample.csv"
                : "company-job-bulk-upload-sample.csv"
            }`}
            target="_blank"
            download
            className="text-gray-500 w-full text-sm py-2 px-6 mt-3
            border border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 flex gap-2 items-center justify-center
            "
          >
            Download sample
            <Download className="size-5" />
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-gray-500 text-sm py-2 px-6
            border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 flex gap-2 items-center justify-center"
            onClick={setBulkUploadPopup}
          >
            Cancel
          </button>
          <button
            disabled={isBulkUploadLoading}
            className="bg-custom-blue hover:bg-custom-blue/90 rounded-md py-2 px-6 text-white flex items-center justify-center"
          >
            Upload
            {isBulkUploadLoading && (
              <>
                {"ing"}
                <span className="button-loader ml-2"></span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUpload;
