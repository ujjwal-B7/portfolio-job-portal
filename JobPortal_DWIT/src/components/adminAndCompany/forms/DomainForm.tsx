"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { Domain } from "@/lib/types";

import {
  useCreateDomainMutation,
  useUpdateDomainMutation,
  useGetSingleDomainDetailsQuery,
} from "@/lib/store/features/domainApi";

import Input from "@/components/ui/Input";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import FormSubmitButton from "@/components/ui/FormSubmitButton";

interface DomainFormProps {
  type: string;
  domainId?: string;
}

const DomainForm = ({ type, domainId }: DomainFormProps) => {
  const router = useRouter();

  const { loggedInUserId, role } = useSelector(
    (state: RootState) => state.authenticated
  );

  //create title toolkit api
  const [
    createDomain,
    {
      isLoading: isCreateDomainLoading,
      isError: isCreateDomainError,
      isSuccess: isCreateDomainSuccess,
    },
  ] = useCreateDomainMutation();

  //fetching single title details for update case

  const { data: domain, isSuccess: isSingleDomainDetailsSuccess } =
    useGetSingleDomainDetailsQuery(domainId, {
      skip: type !== "updateDomain",
    });

  // update domian toolkit api
  const [
    updateDomain,
    {
      isLoading: isUpdateDomainLoading,
      isError: isUpdateDomainError,
      isSuccess: isUpdateDomainSuccess,
    },
  ] = useUpdateDomainMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Domain>({
    defaultValues: {
      domain: "",
    },
  });

  // create / update title handler
  const onSubmit: SubmitHandler<Domain> = async (domainDetails) => {
    const domainDetailsWithCreatorId = {
      ...domainDetails,
      creatorId: loggedInUserId,
    };
    try {
      //create title function
      if (type === "createDomain") {
        await createDomain(domainDetailsWithCreatorId).unwrap();
        if (isCreateDomainError) return new Error("Domain updating error");
        toast.success("Domain created successfully.");
      }
      //update title function
      if (type === "updateDomain") {
        await updateDomain({ domainId, domainDetailsWithCreatorId }).unwrap();
        if (isUpdateDomainError) return new Error("Title updating error");
        toast.success("Domain updated successfully");
      }

      router.push(`/${role}/view/domain`);
    } catch (error: any) {
      console.log("DOMAIN_ERROR", error);
      toast.error(error.data.message);
    }
  };

  //setting the domains values to the input fields for update case
  useEffect(() => {
    if (type === "updateDomain" && isSingleDomainDetailsSuccess && domain) {
      reset(domain);
    }
  }, [type, isSingleDomainDetailsSuccess, domain, reset]);
  return (
    <>
      <form
        className="px-4 space-y-4 w-full max-w-large mx-auto h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("domain", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Title cannot be empty or whitespace",
          })}
          error={errors.domain?.message}
          id="domain"
          type="text"
          label="Domain"
        />

        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateDomainLoading || isUpdateDomainLoading}
            isCreateMode={type === "createDomain"}
          />
        </div>
      </form>
    </>
  );
};

export default DomainForm;
