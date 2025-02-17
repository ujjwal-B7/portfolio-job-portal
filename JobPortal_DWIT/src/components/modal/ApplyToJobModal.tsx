import { toast } from "react-toastify";

import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/Input";
import { useRef, useState } from "react";
import { CircleX, Upload } from "lucide-react";

import { Job } from "@/lib/types";

import { useApplyToJobMutation } from "@/lib/store/features/jobApplicationApi";

interface ApplyToJobModalProp {
  job: Job;
  refetch: () => void;
  setShowApplyToJobPopup: () => void;
}

interface Form {
  company: string;
  title: string;
  role: string;
  experience: string;
  cv_pdf: string;
  cover_letter_pdf: string;
  companyId: string;
  jobId: string;
}

const ApplyToJobModal = ({
  job,
  refetch,
  setShowApplyToJobPopup,
}: ApplyToJobModalProp) => {
  const cvUploadRef = useRef<HTMLInputElement>(null);
  const coverLetterUploadRef = useRef<HTMLInputElement>(null);
  const [selectedCv, setSelectedCv] = useState<string>("");
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string>("");

  const [cvTypeError, setCvTypeError] = useState<string>("");
  const [coverLetterTypeError, setCoverLetterTypeError] = useState<string>("");

  const [applyToJob, { isLoading: isApplyToJobLoading }] =
    useApplyToJobMutation();

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      company: job?.profileId?.name || job?.companyId?.company,
      title: job?.title,
      role: job?.role,
      experience: "",
      cv_pdf: "",
      cover_letter_pdf: "",
      jobId: job?._id,
      companyId: job?.creatorId,
    },
  });

  const cleanUpErrorMessage = () => {
    const timeout = setTimeout(() => {
      setCvTypeError("");
      setCoverLetterTypeError("");
    }, 4000);

    return () => clearTimeout(timeout);
  };

  const onSubmit: SubmitHandler<Form> = async (applicationDetails) => {
    try {
      // if (applicationDetails.company !== job?.company) {
      //   applicationDetails.company = job?.company;
      // }
      // if (applicationDetails.title !== job?.title) {
      //   applicationDetails.title = job?.title;
      // }

      // if (applicationDetails.role !== job?.role) {
      //   applicationDetails.role = job?.role;
      // }

      const formData = new FormData();
      // formData.set("company", applicationDetails.company);
      // formData.set("title", applicationDetails.title);
      // formData.set("role", applicationDetails.role);
      formData.set("experience", applicationDetails.experience);
      formData.set("jobId", applicationDetails.jobId);
      formData.set("companyId", applicationDetails.companyId);
      formData.append("cv_pdf", applicationDetails.cv_pdf);
      formData.append("cover_letter_pdf", applicationDetails.cover_letter_pdf);

      await applyToJob(formData);
      refetch();
      setShowApplyToJobPopup();
      toast.success("Applied to job successfully.");
    } catch (error) {
      console.log("APPLICATION_SUBMISSION_ERROR", error);
    }
  };

  return (
    <div className="w-full h-screen bg-black/60 fixed inset-0 z-[1000] flex items-center justify-center font-switzer-regular">
      <form
        className="max-w-[40rem] w-full bg-white py-8 px-10 rounded-md space-y-4 m-4"
        data-aos="zoom-in"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between">
          <div></div>
          <h1 className="text-xl font-semibold text-center mb-4">
            Apply To Job
          </h1>
          <CircleX
            className="text-gray-400 cursor-pointer w-6 h-6"
            onClick={setShowApplyToJobPopup}
          />
        </div>
        <Input
          {...register("company", {
            required: "Required.",
          })}
          error={errors.company?.message}
          id="company"
          type="text"
          label="Company"
          readOnly
        />
        <Input
          {...register("title", {
            required: "Required.",
          })}
          error={errors.title?.message}
          id="title"
          type="text"
          label="Job Title"
          readOnly
        />
        <Input
          {...register("role", {
            required: "Required.",
          })}
          error={errors.role?.message}
          id="role"
          type="text"
          label="Role"
          readOnly
        />
        <Input
          {...register("experience", {
            required: "Required.",
          })}
          error={errors.experience?.message}
          id="experience"
          type="text"
          numeric={true}
          label="How many years of experience do you have?"
        />

        {/* cv and cover letter upload ref */}
        <div className="flex gap-4">
          <div className="w-[50%] relative">
            <input
              {...register("cv_pdf", {
                required: "Required.",
              })}
              accept="application/pdf"
              id="cv_pdf"
              type="file"
              ref={cvUploadRef}
              className="absolute opacity-0 cursor-pointer"
              onChange={(e) => {
                const file: any = e.target.files?.[0];
                if (
                  file &&
                  file?.name.split(".").pop()?.toLowerCase() !== "pdf"
                ) {
                  setCvTypeError("Only pdf are allowed.");
                  cleanUpErrorMessage();
                  return;
                }
                setSelectedCv(file?.name);
                setValue("cv_pdf", file);
              }}
            />
            <div
              className="border-2 border-dashed border-gray-400 p-2 rounded-md cursor-pointer flex items-center justify-center"
              onClick={() => cvUploadRef.current?.click()}
            >
              <div className="flex gap-4 items-center justify-center">
                <Upload className="text-custom-blue" />
                <span className="text-gray-400 text-sm">Upload your cv</span>
              </div>
            </div>
            {cvTypeError && (
              <p className="text-red-600 text-sm m">{cvTypeError}</p>
            )}
            {selectedCv && !cvTypeError && (
              <p className="bg-hover-light text-gray-600 w-fit py-1 px-1.5 text-sm rounded-md mt-1.5">
                {selectedCv}
              </p>
            )}
            <p className="text-red-600 text-sm">{errors.cv_pdf?.message}</p>
          </div>
          <div className="w-[50%] relative">
            <input
              {...register("cover_letter_pdf", {
                required: "Required.",
              })}
              accept="application/pdf"
              id="cover_letter_pdf"
              type="file"
              ref={coverLetterUploadRef}
              className="absolute opacity-0 cursor-pointer"
              onChange={(e) => {
                const file: any = e.target.files?.[0];
                if (
                  file &&
                  file?.name.split(".").pop()?.toLowerCase() !== "pdf"
                ) {
                  setCoverLetterTypeError("Only pdf are allowed.");
                  cleanUpErrorMessage();
                  return;
                }
                setSelectedCoverLetter(file?.name);
                setValue("cover_letter_pdf", file);
              }}
            />
            <div
              className="border-2 border-dashed border-gray-400 p-2 rounded-md cursor-pointer flex items-center justify-center"
              onClick={() => coverLetterUploadRef.current?.click()}
            >
              <div className="flex gap-4 items-center justify-center">
                <Upload className="text-custom-blue" />

                <span className="text-gray-400 text-sm">
                  Upload your cover letter
                </span>
              </div>
            </div>
            {coverLetterTypeError && (
              <p className="text-red-600 text-sm m">{coverLetterTypeError}</p>
            )}
            {selectedCoverLetter && !coverLetterTypeError && (
              <p className="bg-hover-light text-gray-600 w-fit py-1 px-1.5 text-sm rounded-md mt-1.5">
                {selectedCoverLetter}
              </p>
            )}
            <p className="text-red-600 text-sm">
              {errors.cover_letter_pdf?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-1">
          <button
            disabled={isApplyToJobLoading}
            className={`bg-custom-blue text-white rounded-md px-10 h-10 hover:bg-hover-blue font-bold flex items-center justify-center  ${
              isApplyToJobLoading && "cursor-not-allowed"
            }`}
          >
            Apply{" "}
            {isApplyToJobLoading && <span className="button-loader"></span>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyToJobModal;
