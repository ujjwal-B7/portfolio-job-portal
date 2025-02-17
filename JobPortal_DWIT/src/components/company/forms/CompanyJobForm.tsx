"use client";

import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Job } from "@/lib/types";

import {
  useCreateJobMutation,
  useGetSingleJobDetailsQuery,
  useUpdateJobDetailsMutation,
} from "@/lib/store/features/jobsApi";
import JobInput from "@/components/ui/JobInput";

// Load React Quill dynamically
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { useGetAllTypesQuery } from "@/lib/store/features/typeApi";
import { useGetAllTitlesQuery } from "@/lib/store/features/titleApi";
import { useGetAllDomainsQuery } from "@/lib/store/features/domainApi";
import { useGetAllTechnologiesQuery } from "@/lib/store/features/technologyApi";
import { useGetAllRolesQuery } from "@/lib/store/features/roleApi";
import { useGetAllSalariesQuery } from "@/lib/store/features/salaryApi";
import Input from "@/components/ui/Input";
import { Loader2 } from "lucide-react";
import { useGetSingleProfileDetailsByCreatorIdQuery } from "@/lib/store/features/profileApi";
import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import FormSubmitButton from "@/components/ui/FormSubmitButton";
import DatePicker from "react-datepicker";

interface JobFormProps {
  type: string;
  jobId?: string;
}

interface CompanyDetailsProps {
  _id: string;
  company: string;
  description: string;
  logo: string;
}

const JobForm = ({ type, jobId }: JobFormProps) => {
  const router = useRouter();
  const [imagePreview, setShowImagePreview] = useState<string>("");
  const { loggedInUserId, role } = useSelector(
    (state: RootState) => state.authenticated
  );

  const [profileId, setProfileId] = useState("");

  const { data: profile, isLoading: isProfileLoading } =
    useGetSingleProfileDetailsByCreatorIdQuery(loggedInUserId);

  // create job toolkit api
  const [
    createJob,
    {
      isLoading: isCreateJobLoading,
      isError: isCreateJobError,
      isSuccess: isCreateJobSuccess,
    },
  ] = useCreateJobMutation();

  //fetching single job
  const { data: job, isSuccess: isSingleJobDetailsSuccess } =
    useGetSingleJobDetailsQuery(jobId, {
      skip: type !== "updateJob",
    });

  //update job toolkit api
  const [
    updateJobDetails,
    {
      data: updatedJob,
      isLoading: isUpdateJobLoading,
      isError: isUpdateJobError,
      isSuccess: isUpdateJobSuccess,
    },
  ] = useUpdateJobDetailsMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<Job>({
    // resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      technology: "",
      salary: "",
      role: "",
      domain: "",
      experience: "",
      type: "",
      location: "",
      // company: "",
      // companydescription: "",
      // logo: "",
      description: "",
      qualification: "",
      applicationStart: "",
      applicationDeadline: "",
    },
  });

  // create / update job handler
  const onSubmit: SubmitHandler<Job> = async (jobDetails) => {
    // const { company, companydescription, logo, ...rest } = jobDetails;

    const jobDetailsWithCreatorId = {
      ...jobDetails,
      // logo: profile.logo,
      // // company: profile.name,
      // // companyDescription:profile.description
      creatorId: loggedInUserId,
      profileId: profile._id,
    };

    try {
      //create job function
      if (type === "createJob") {
        await createJob(jobDetailsWithCreatorId).unwrap();
        if (isCreateJobError) return new Error("Job creating error");
        toast.success("Job created successfully");
      }

      //update job function
      if (type === "updateJob") {
        await updateJobDetails({ jobId, jobDetailsWithCreatorId }).unwrap();
        if (isUpdateJobError) return new Error("Job updating error");
        toast.success("Job updated successfully");
      }

      router.push(`/${role}`);
    } catch (error) {
      console.log("JOB_ERROR", error);
    }
  };

  //setting the jobs values to the jobInput fields for update job case
  useEffect(() => {
    if (type === "updateJob" && isSingleJobDetailsSuccess && job) {
      const formattedData = {
        ...job,
        applicationStart:
          new Date(job.applicationStart).toISOString().split("T")[0] || "",
        applicationDeadline:
          new Date(job.applicationDeadline).toISOString().split("T")[0] || "",
      };
      setProfileId(job.profileId._id);
      reset(formattedData);
    }
  }, [type, isSingleJobDetailsSuccess, job, reset]);

  // all the dropdown options for creating job are fetched here
  const [isDataFetched, setIsDataFetched] = useToggle();

  const {
    data: allTitles,
    isLoading: isTitleLoading,
    refetch: refetchTitles,
  } = useGetAllTitlesQuery({});
  const {
    data: allDomains,
    isLoading: isDomainLoading,
    refetch: refetchDomains,
  } = useGetAllDomainsQuery({});
  const {
    data: allTechnologies,
    isLoading: isTechnologyLoading,
    refetch: refetchTechnologies,
  } = useGetAllTechnologiesQuery({});
  const {
    data: allRoles,
    isLoading: isRoleLoading,
    refetch: refetchRoles,
  } = useGetAllRolesQuery({});
  const {
    data: allSalarys,
    isLoading: isSalaryLoading,
    refetch: refetchSalaries,
  } = useGetAllSalariesQuery({});
  const {
    data: allTypes,
    isLoading: isTypeLoading,
    refetch: refetchTypes,
  } = useGetAllTypesQuery({});

  useEffect(() => {
    if (!isDataFetched) {
      refetchTitles();
      refetchDomains();
      refetchTechnologies();
      refetchRoles();
      refetchSalaries();
      refetchTypes();
      setIsDataFetched();
    }
  }, [
    isDataFetched,
    refetchTitles,
    refetchDomains,
    refetchTechnologies,
    refetchRoles,
    refetchSalaries,
    refetchTypes,
    setIsDataFetched,
  ]);

  if (
    isTitleLoading ||
    isProfileLoading ||
    isDomainLoading ||
    isTechnologyLoading ||
    isRoleLoading ||
    isSalaryLoading ||
    isTypeLoading
  ) {
    return (
      <div className="w-full h-[60vh] flex items-center  justify-center">
        <Loader2 className="animate-[spin_0.5s_linear_infinite] text-custom-blue w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      <form
        className="px-4 w-full max-w-large mx-auto space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <div className="flex sm:flex-row flex-col gap-4 ">
          <div className="sm:w-[50%]">
            <JobInput
              {...register("title", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" || "Title cannot be empty or whitespace",
              })}
              error={errors.title?.message}
              id="title"
              type="text"
              label="Job Title"
              options={allTitles}
              setValue={setValue}
            />
          </div>
          <div className="sm:w-[50%]">
            <Input
              {...register("location", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" ||
                  "Location cannot be empty or whitespace",
              })}
              error={errors.location?.message}
              id="location"
              type="text"
              label="Location"
            />
          </div>
        </div>

        <div className="flex sm:flex-row flex-col gap-4 ">
          <div className="sm:w-[50%]">
            <JobInput
              {...register("technology", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" ||
                  "Technology cannot be empty or whitespace",
              })}
              error={errors.technology?.message}
              id="technology"
              type="text"
              label="Technology"
              options={allTechnologies}
              setValue={setValue}
            />
          </div>
          <div className="sm:w-[50%]">
            <JobInput
              {...register("role", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" || "Role cannot be empty or whitespace",
              })}
              error={errors.role?.message}
              id="role"
              type="text"
              label="Role"
              options={allRoles}
              setValue={setValue}
            />
          </div>
        </div>
        <div className="flex sm:flex-row flex-col gap-4 ">
          <div className="sm:w-[50%]">
            <JobInput
              {...register("domain", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" || "Domain cannot be empty or whitespace",
              })}
              error={errors.domain?.message}
              id="domain"
              type="text"
              label="Domain"
              options={allDomains}
              setValue={setValue}
            />
          </div>
          <div className="sm:w-[50%]">
            <JobInput
              {...register("salary", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" || "Salary cannot be empty or whitespace",
              })}
              error={errors.salary?.message}
              id="salary"
              type="text"
              label="Salary"
              options={allSalarys}
              setValue={setValue}
            />
          </div>
        </div>

        <div className="flex sm:flex-row flex-col gap-4 ">
          <div className="sm:w-[50%]">
            <Input
              {...register("experience", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" ||
                  "Experience cannot be empty or whitespace",
              })}
              error={errors.experience?.message}
              id="experience"
              type="text"
              label="Experience ( yrs )"
              numeric={true}
            />
          </div>
          <div className="sm:w-[50%]">
            <JobInput
              {...register("type", {
                required: "Required.",
                validate: (value) =>
                  value.trim() !== "" || "Type cannot be empty or whitespace",
              })}
              error={errors.type?.message}
              id="type"
              type="text"
              label="Type"
              options={allTypes}
              setValue={setValue}
            />
          </div>
        </div>
        <div className="z-0">
          <Controller
            name="description"
            control={control}
            rules={{
              required: "Required.",

              validate: (value) =>
                value.trim() !== "" ||
                "Description cannot be empty or whitespace",
            }}
            render={({ field }) => (
              <div>
                <label htmlFor="description" className="text-4 mb-1">
                  Requirement
                </label>
                <br />
                <ReactQuill
                  {...field}
                  className="-z-10 border-2 border-[#c7c7c7] rounded-md  focus:outline-none focus:ring focus:ring-blue-200  w-full mb-4"
                  placeholder="Requirement"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="qualification"
            control={control}
            rules={{
              required: "Required.",
              validate: (value) =>
                value.trim() !== "" ||
                "Qualification cannot be empty or whitespace",
            }}
            render={({ field }) => (
              <div>
                <label htmlFor="qualification" className="text-4 mb-1">
                  Qualification
                </label>{" "}
                <br />
                <ReactQuill
                  {...field}
                  className="z-1 border-2 border-[#c7c7c7] rounded-md  focus:outline-none focus:ring focus:ring-blue-200 mb-1 w-full"
                  placeholder="Qualification"
                />
                {errors.qualification && (
                  <p className="text-red-600 text-sm">
                    {errors.qualification.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        {/* <div className="flex sm:flex-row flex-col gap-4 ">
          <div className="sm:w-[50%]">
            <Input
              {...register("applicationStart", {
                required: "Required.",
                validate: (value) => {
                  const applicationStart = new Date(value);
                  const applicationDeadline = new Date(
                    watch("applicationDeadline")
                  );
                  return (
                    applicationStart < applicationDeadline ||
                    "Application start date must be before the application deadline."
                  );
                },
              })}
              error={errors.applicationStart?.message}
              id="applicationStart"
              type="date"
              label="ApplicationStart"
              min={
                type === "updateJob"
                  ? ""
                  : new Date().toISOString().split("T")[0]
              }
            />
          </div>
          <div className="sm:w-[50%]">
            <Input
              {...register("applicationDeadline", {
                required: "Required.",
                validate: (value) => {
                  const applicationDeadline = new Date(value);
                  const applicationStart = new Date(watch("applicationStart"));
                  return (
                    applicationDeadline > applicationStart ||
                    "Application deadline must be after the application start date."
                  );
                },
              })}
              error={errors.applicationDeadline?.message}
              id="applicationDeadline"
              type="date"
              label="ApplicationDeadline"
              min={
                type === "updateJob"
                  ? ""
                  : new Date().toISOString().split("T")[0]
              }
            />
          </div>
        </div> */}

         <div className="flex sm:flex-row flex-col gap-4 ">
                  <div className="sm:w-[50%]">
                    <label className="block font-medium">Application Start</label>
                    <Controller
                      name="applicationStart"
                      control={control}
                      rules={{
                        required: "Required.",
                        validate: (value) => {
                          const applicationStart = new Date(value);
                          const applicationDeadline = new Date(
                            watch("applicationDeadline")
                          );
                          return (
                            applicationStart < applicationDeadline ||
                            "Application start date must be before the application deadline."
                          );
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <>
                          <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date) => {
                              onChange(date?.toISOString());
                            }}
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
                            dateFormat="MM/dd/yyyy"
                            minDate={type === "updateJob" ? undefined : new Date()}
                            placeholderText="mm/dd/yyyy"
                            className="border-2 border-[#c7c7c7] rounded-md px-4 py-2 focus:outline-none focus:ring-[0.1px] focus:ring-custom-blue w-full"
                            wrapperClassName="w-full"
                          />
                          {errors.applicationStart && (
                            <p className="text-red-600 text-sm">
                              {errors.applicationStart.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div className="sm:w-[50%]">
                    <label className="block font-medium">Application Deadline</label>
                    <Controller
                      name="applicationDeadline"
                      control={control}
                      rules={{
                        required: "Required.",
                        validate: (value) => {
                          if (!value) return "Required.";
                          const applicationDeadline = new Date(value);
                          const applicationStart = new Date(watch("applicationStart"));
                          return (
                            applicationDeadline > applicationStart ||
                            "Application deadline must be after the application start date."
                          );
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <>
                          <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date) => {
                              onChange(date?.toISOString());
                            }}
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
                            dateFormat="MM/dd/yyyy"
                            minDate={type === "updateJob" ? undefined : new Date()}
                            placeholderText="mm/dd/yyyy"
                            className="border-2 border-[#c7c7c7] rounded-md px-4 py-2 focus:outline-none focus:ring-[0.1px] focus:ring-custom-blue w-full"
                            wrapperClassName="w-full"
                          />
                          {errors.applicationDeadline && (
                            <p className="text-red-600 text-sm">
                              {errors.applicationDeadline.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateJobLoading || isUpdateJobLoading}
            isCreateMode={type === "createJob"}
          />
        </div>
      </form>
    </>
  );

  // function to set the selected company details
  function setDescriptionValueRecievedAsProp(details: CompanyDetailsProps) {
    setValue("companydescription", details.description, {
      shouldDirty: true,
    });
    setValue("logo", details.logo, {
      shouldDirty: true,
    });

    setShowImagePreview(details.logo);
  }
};

export default JobForm;
