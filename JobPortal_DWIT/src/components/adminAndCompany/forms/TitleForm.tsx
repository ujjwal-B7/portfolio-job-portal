"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { Title } from "@/lib/types";

import {
  useCreateTitleMutation,
  useGetSingleTitleDetailsQuery,
  useUpdateTitleMutation,
} from "@/lib/store/features/titleApi";

import Input from "@/components/ui/Input";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import FormSubmitButton from "@/components/ui/FormSubmitButton";

interface TitleFormProps {
  type: string;
  titleId?: string;
}

const TitleForm = ({ type, titleId }: TitleFormProps) => {
  const router = useRouter();

  const { loggedInUserId, role } = useSelector(
    (state: RootState) => state.authenticated
  );

  //create title toolkit api
  const [
    createTitle,
    {
      isLoading: isCreateTitleLoading,
      isError: isCreateTitleError,
      isSuccess: isCreateTitleSuccess,
    },
  ] = useCreateTitleMutation();

  //fetching single title details for update case
  const { data: title, isSuccess: isSingleTitleDetailsSuccess } =
    useGetSingleTitleDetailsQuery(titleId, {
      skip: type !== "updateTitle",
    });

  // update title toolkit api
  const [
    updateTitle,
    {
      isLoading: isUpdateTitleLoading,
      isError: isUpdateTitleError,
      isSuccess: isUpdateTitleSuccess,
    },
  ] = useUpdateTitleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Title>({
    defaultValues: {
      title: "",
    },
  });

  // create / update title handler
  const onSubmit: SubmitHandler<Title> = async (titleDetails) => {
    const titleDetailsWithCreatorId = {
      ...titleDetails,
      creatorId: loggedInUserId,
    };

    try {
      //create title function
      if (type === "createTitle") {
        await createTitle(titleDetailsWithCreatorId).unwrap();
        if (isCreateTitleError) return new Error("Title updating error");
        toast.success("Title created successfully.");
      }
      //update title function
      if (type === "updateTitle") {
        await updateTitle({ titleId, titleDetailsWithCreatorId }).unwrap();
        if (isUpdateTitleError) return new Error("Title updating error");
        toast.success("Title updated successfully");
      }
      router.push(`/${role}/view/title`);
    } catch (error: any) {
      console.log("TITLE_ERROR", error);
      toast.error(error.data.message);
    }
  };

  //setting the titles values to the input fields for update case
  useEffect(() => {
    if (type === "updateTitle" && isSingleTitleDetailsSuccess && title) {
      reset(title);
    }
  }, [type, isSingleTitleDetailsSuccess, title, reset]);
  return (
    <>
      <form
        className="px-4 w-full space-y-4 max-w-large mx-auto h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("title", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Title cannot be empty or whitespace",
          })}
          error={errors.title?.message}
          id="title"
          type="text"
          label="Title"
        />

        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateTitleLoading || isUpdateTitleLoading}
            isCreateMode={type === "createTitle"}
          />
        </div>
      </form>
    </>
  );
};

export default TitleForm;
