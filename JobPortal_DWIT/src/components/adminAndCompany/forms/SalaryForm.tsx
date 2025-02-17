"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { Salary } from "@/lib/types";

import {
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useGetSingleSalaryDetailsQuery,
} from "@/lib/store/features/salaryApi";

import Input from "@/components/ui/Input";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import FormSubmitButton from "@/components/ui/FormSubmitButton";

interface SalaryFormProps {
  type: string;
  salaryId?: string;
}

const SalaryForm = ({ type, salaryId }: SalaryFormProps) => {
  const router = useRouter();
  const { role, loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  //create title toolkit api
  const [
    createSalary,
    {
      isLoading: isCreateSalaryLoading,
      isError: isCreateSalaryError,
      isSuccess: isCreateSalarySuccess,
    },
  ] = useCreateSalaryMutation();

  //fetching single title details for update case

  const { data: salary, isSuccess: isSingleSalaryDetailsSuccess } =
    useGetSingleSalaryDetailsQuery(salaryId, {
      skip: type !== "updateSalary",
    });

  // update domian toolkit api
  const [
    updateSalary,
    {
      isLoading: isUpdateSalaryLoading,
      isError: isUpdateSalaryError,
      isSuccess: isUpdateSalarySuccess,
    },
  ] = useUpdateSalaryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Salary>({
    defaultValues: {
      salary: "",
    },
  });

  // create / update salary handler
  const onSubmit: SubmitHandler<Salary> = async (salaryDetails) => {
    const salaryDetailsWithCreatorId = {
      ...salaryDetails,
      creatorId: loggedInUserId,
    };

    try {
      //create salary function
      if (type === "createSalary") {
        await createSalary(salaryDetailsWithCreatorId).unwrap();
        if (isCreateSalaryError) return new Error("Salary updating error");
        toast.success("Salary created successfully.");
      }
      //update salary function
      if (type === "updateSalary") {
        await updateSalary({ salaryId, salaryDetailsWithCreatorId }).unwrap();
        if (isUpdateSalaryError) return new Error("Salary updating error");
        toast.success("Salary updated successfully");
      }

      router.push(`/${role}/view/salary`);
    } catch (error: any) {
      console.log("SALARY_ERROR", error);
      toast.error(error.data.message);
    }
  };

  //setting the salarys values to the input fields for update case
  useEffect(() => {
    if (type === "updateSalary" && isSingleSalaryDetailsSuccess && salary) {
      reset(salary);
    }
  }, [type, isSingleSalaryDetailsSuccess, salary, reset]);
  return (
    <>
      <form
        className="px-4 space-y-4 w-full max-w-large mx-auto h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("salary", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Title cannot be empty or whitespace",
          })}
          error={errors.salary?.message}
          id="salary"
          type="text"
          label="Salary"
        />
        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateSalaryLoading || isUpdateSalaryLoading}
            isCreateMode={type === "createSalary"}
          />
        </div>
      </form>
    </>
  );
};

export default SalaryForm;
