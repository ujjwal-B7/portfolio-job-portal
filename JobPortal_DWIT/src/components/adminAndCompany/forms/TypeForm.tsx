"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { Type } from "@/lib/types";

import {
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useGetSingleTypeDetailsQuery,
} from "@/lib/store/features/typeApi";

import Input from "@/components/ui/Input";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import FormSubmitButton from "@/components/ui/FormSubmitButton";

interface TypeFormProps {
  type: string;
  typeId?: string;
}

const TypeForm = ({ type, typeId }: TypeFormProps) => {
  const router = useRouter();
  const { role, loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  //create title toolkit api
  const [
    createType,
    {
      isLoading: isCreateTypeLoading,
      isError: isCreateTypeError,
      isSuccess: isCreateTypeSuccess,
    },
  ] = useCreateTypeMutation();

  //fetching single title details for update case

  const { data: types, isSuccess: isSingleTypeDetailsSuccess } =
    useGetSingleTypeDetailsQuery(typeId, {
      skip: type !== "updateType",
    });

  // update domian toolkit api
  const [
    updateType,
    {
      isLoading: isUpdateTypeLoading,
      isError: isUpdateTypeError,
      isSuccess: isUpdateTypeSuccess,
    },
  ] = useUpdateTypeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Type>({
    defaultValues: {
      types: "",
    },
  });

  // create / update title handler
  const onSubmit: SubmitHandler<Type> = async (typeDetails) => {
    const typeDetailsWithCreatorId = {
      ...typeDetails,
      creatorId: loggedInUserId,
    };
    try {
      //create title function
      if (type === "createType") {
        await createType(typeDetailsWithCreatorId).unwrap();
        if (isCreateTypeError) return new Error("Type updating error");
        toast.success("Type created successfully.");
      }
      //update title function
      if (type === "updateType") {
        await updateType({ typeId, typeDetailsWithCreatorId }).unwrap();
        if (isUpdateTypeError) return new Error("Title updating error");
        toast.success("Type updated successfully");
      }

      router.push(`/${role}/view/type`);
    } catch (error: any) {
      console.log("TYPE_ERROR", error);
      toast.error(error.data.message);
    }
  };

  //setting the types values to the input fields for update case
  useEffect(() => {
    if (type === "updateType" && isSingleTypeDetailsSuccess && types) {
      reset(types);
    }
  }, [type, isSingleTypeDetailsSuccess, types, reset]);
  return (
    <>
      <form
        className="px-4 w-full space-y-4 max-w-large mx-auto h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("types", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Title cannot be empty or whitespace",
          })}
          error={errors.types?.message}
          id="types"
          type="text"
          label="Type"
        />

        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateTypeLoading || isUpdateTypeLoading}
            isCreateMode={type === "createType"}
          />
        </div>
      </form>
    </>
  );
};

export default TypeForm;
