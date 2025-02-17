"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { Technology } from "@/lib/types";

import {
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
  useGetSingleTechnologyDetailsQuery,
} from "@/lib/store/features/technologyApi";

import Input from "@/components/ui/Input";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import FormSubmitButton from "@/components/ui/FormSubmitButton";

interface TechnologyFormProps {
  type: string;
  technologyId?: string;
}

const TechnologyForm = ({ type, technologyId }: TechnologyFormProps) => {
  const router = useRouter();

  const { loggedInUserId, role } = useSelector(
    (state: RootState) => state.authenticated
  );

  //create title toolkit api
  const [
    createTechnology,
    {
      isLoading: isCreateTechnologyLoading,
      isError: isCreateTechnologyError,
      isSuccess: isCreateTechnologySuccess,
    },
  ] = useCreateTechnologyMutation();

  //fetching single title details for update case
  const { data: technology, isSuccess: isSingleTechnologyDetailsSuccess } =
    useGetSingleTechnologyDetailsQuery(technologyId, {
      skip: type !== "updateTechnology",
    });

  // update domian toolkit api
  const [
    updateTechnology,
    {
      isLoading: isUpdateTechnologyLoading,
      isError: isUpdateTechnologyError,
      isSuccess: isUpdateTechnologySuccess,
    },
  ] = useUpdateTechnologyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Technology>({
    defaultValues: {
      technology: "",
    },
  });

  // create / update title handler
  const onSubmit: SubmitHandler<Technology> = async (technologyDetails) => {
    const technologyDetailsWithCreatorId = {
      ...technologyDetails,
      creatorId: loggedInUserId,
    };

    try {
      //create title function
      if (type === "createTechnology") {
        await createTechnology(technologyDetailsWithCreatorId).unwrap();
        if (isCreateTechnologyError)
          return new Error("Technology updating error");
        toast.success("Technology created successfully.");
      }
      //update title function
      if (type === "updateTechnology") {
        await updateTechnology({
          technologyId,
          technologyDetailsWithCreatorId,
        }).unwrap();
        if (isUpdateTechnologyError)
          return new Error("Technology updating error");
        toast.success("Technology updated successfully");
      }

      router.push(`/${role}/view/technology`);
    } catch (error: any) {
      console.log("TECHNOLOGY_ERROR", error);
      toast.error(error.data.message);
    }
  };

  //setting the technologys values to the input fields for update case
  useEffect(() => {
    if (
      type === "updateTechnology" &&
      isSingleTechnologyDetailsSuccess &&
      technology
    ) {
      reset(technology);
    }
  }, [type, isSingleTechnologyDetailsSuccess, technology, reset]);

  return (
    <>
      <form
        className="px-4 w-full max-w-large space-y-4 mx-auto h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("technology", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Technology cannot be empty or whitespace",
          })}
          error={errors.technology?.message}
          id="technology"
          type="text"
          label="Technology"
        />

        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateTechnologyLoading || isUpdateTechnologyLoading}
            isCreateMode={type === "createTechnology"}
          />
        </div>
      </form>
    </>
  );
};

export default TechnologyForm;
