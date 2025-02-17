import { CircleX } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Input from "../../ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { WithContext as ReactTagInput } from "react-tag-input";
import { useCreateOpenToWorkMutation } from "@/lib/store/features/openToWorkApi";
import { toast } from "react-toastify";

import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import useToggle from "@/hooks/useToggle";

interface Tag {
  id: string;
  text: string;
  className?: string;
}

interface Form {
  job_title: string;
  employee_name: string;
  email: string;
  contact_number: string;
  salary: string;
  skills_array: string[];
  experience: string;
  degree: string;
}

const OpenToWork = () => {
  const openToWorkRef = useRef<HTMLInputElement>(null);
  const { name, email, contact_number, loggedInUserToken } = useSelector(
    (state: RootState) => state.authenticated
  );

  const [
    createOpenToWork,
    {
      isLoading: isCreateOpenToWorkLoading,
      isSuccess: isCreateOpenToWorkSuccess,
    },
  ] = useCreateOpenToWorkMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      job_title: "",
      employee_name: "",
      email: "",
      contact_number: "",
      salary: "",
      skills_array: [],
      experience: "",
      degree: "",
    },
  });

  // form submit handler
  const onSubmit: SubmitHandler<Form> = async (details) => {
    try {
      const res = await createOpenToWork(details).unwrap();
      console.log("response", res);
      if (res?.success) {
        close();
        toast.success("Request posted successfully.");
      }
    } catch (error) {
      toast.error("Internal server error.");
      console.log("OPEN_TO_WORK_ERROR", error);
    }
  };

  const router = useRouter();
  const [showOpenToWorkPopup, setShowOpenToWork, close] = useToggle();

  const handleOpenToWork = () => {
    console.log("entered here");
    if (!loggedInUserToken) {
      toast.success("Login to apply for open to work.");
      return router.push("/employee/login");
    }
    setShowOpenToWork();
  };

  const [skills, setSkills] = useState<string[]>([]);

  const handleDelete = (i: number) => {
    setSkills(skills.filter((_, index) => index !== i));
  };

  const handleAddition = (tag: Tag) => {
    const updatedSkills = [...skills, tag.text];
    setSkills(updatedSkills);
  };

  useEffect(() => {
    setValue("skills_array", skills as any);
  }, [skills, setValue]);

  // close modal
  useEffect(() => {
    const handleClick = (e: any) => {
      if (!openToWorkRef?.current?.contains(e.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [openToWorkRef, close]);

  return (
    <>
      <center className="text-gray-600 text-2xl font-semibold pt-5">
        <Image
          src="/images/no-search-result.svg"
          width={180}
          height={180}
          alt="not-found"
        />
        No job found
        <p className="text-gray-500 text-sm font-normal pt-4 px-2">
          Don&rsquo;t worry! Request specific positions from us. Let us know
          what you&rsquo;re looking for!
        </p>
        <button
          className="bg-[#f2763d] hover:bg-[#f2763d]/90 rounded-md px-4 text-white text-sm py-2 mt-4 flex items-center gap-1"
          onClick={handleOpenToWork}
        >
          <MessageSquare className="size-5" />
          Request Position
        </button>
      </center>

      {showOpenToWorkPopup && (
        <div className="w-full h-screen fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] px-6 font-arial-rounded-regular">
          <div
            ref={openToWorkRef}
            className="bg-white rounded-md max-w-[50rem] h-[90%] overflow-y-auto sm:p-6 p-4"
            data-aos="zoom-in"
          >
            <div className="flex justify-between border-b border-b-gray-400 pb-4">
              <h1 className="text-gray-900 text-xl font-semibold tracking-wide">
                Request for a Position
              </h1>
              <CircleX className="cursor-pointer" onClick={close} />
            </div>
            <p className="text-sm text-gray-400 pt-2">
              Can&rsquo;t find the position you&rsquo;re looking for? No
              problem! Fill out the form below to request it, and we&rsquo;ll do
              our best to help you find the perfect match.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
              <Input
                {...register("job_title", {
                  required: "Required.",
                  validate: (value: string) =>
                    value.trim() !== "" || "Name cannot be empty or whitespace",
                })}
                error={errors.job_title?.message}
                id="job_title"
                type="text"
                label="Job Title"
              />
              <Input
                {...register("employee_name", {
                  required: "Required.",
                  validate: (value: string) =>
                    value.trim() !== "" || "Name cannot be empty or whitespace",
                })}
                value={setValue("employee_name", name!)}
                error={errors.employee_name?.message}
                id="employee_name"
                type="text"
                label="Employee Name"
                readOnly
              />
              <Input
                {...register("email", {
                  required: "Required.",
                  validate: (value: string) =>
                    value.trim() !== "" ||
                    "Email cannot be empty or whitespace",
                })}
                value={setValue("email", email!)}
                error={errors.email?.message}
                id="email"
                type="email"
                label="Email"
                readOnly
              />
              <Input
                {...register("contact_number", {
                  required: "Required.",
                  validate: (value: string) =>
                    value.trim() !== "" ||
                    "Contact cannot be empty or whitespace",
                })}
                value={setValue("contact_number", contact_number!)}
                error={errors.contact_number?.message}
                id="contact_number"
                type="text"
                label="Contact Number"
                readOnly
              />
              <Input
                {...register("salary", {
                  required: "Required.",
                  validate: (value: string) =>
                    value.trim() !== "" ||
                    "Salary cannot be empty or whitespace",
                })}
                error={errors.salary?.message}
                id="salary"
                type="text"
                label="Salary"
              />

              <div>
                <label>Skills</label>
                <ReactTagInput
                  tags={skills.map((skill) => ({
                    id: skill, // Ensure id is unique
                    text: skill,
                    className: "", // Provide an empty className to fulfill the type requirement
                  }))}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition as any}
                  inputFieldPosition="inline"
                  placeholder="Add skills and press enter"
                  classNames={{
                    tags: "tagsClass",
                    tagInput: "tagInputClass",
                    tagInputField: "tagInputFieldClass",
                    selected: "selectedClass",
                    tag: "tagClass",
                    remove: "removeClass",
                    suggestions: "suggestionsClass",
                    activeSuggestion: "activeSuggestionClass",
                    editTagInput: "editTagInputClass",
                    editTagInputField: "editTagInputField",
                    clearAll: "clearAllClass",
                  }}
                />
              </div>
              <Input
                {...register("experience", {
                  required: "Required.",
                  validate: (value: string) =>
                    value.trim() !== "" ||
                    "Experience cannot be empty or whitespace",
                })}
                error={errors.experience?.message}
                id="experience"
                type="text"
                label="Experience ( in years )"
                numeric={true}
              />
              <Input
                {...register("degree", {
                  required: "Required.",
                  validate: (value: string) =>
                    value.trim() !== "" ||
                    "Degree cannot be empty or whitespace",
                })}
                error={errors.degree?.message}
                id="degree"
                type="text"
                label="Degree"
              />
              <button
                disabled={isCreateOpenToWorkLoading}
                type="submit"
                className={`bg-custom-blue hover:bg-hover-blue font-bold text-white h-10 sm:w-36 w-full ml-auto rounded-md flex items-center justify-center
            ${isCreateOpenToWorkLoading && "cursor-not-allowed"}`}
              >
                {isCreateOpenToWorkLoading ? (
                  <span className="button-loader"></span>
                ) : (
                  <p>Submit</p>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OpenToWork;
