"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import { Role } from "@/lib/types";

import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetSingleRoleDetailsQuery,
} from "@/lib/store/features/roleApi";

import Input from "@/components/ui/Input";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import FormSubmitButton from "@/components/ui/FormSubmitButton";

interface RoleFormProps {
  type: string;
  roleId?: string;
}

const RoleForm = ({ type, roleId }: RoleFormProps) => {
  const router = useRouter();
  const { loggedInUserId, role: loggedInUserRole } = useSelector(
    (state: RootState) => state.authenticated
  );

  //create title toolkit api
  const [
    createRole,
    {
      isLoading: isCreateRoleLoading,
      isError: isCreateRoleError,
      isSuccess: isCreateRoleSuccess,
    },
  ] = useCreateRoleMutation();

  //fetching single title details for update case

  const { data: role, isSuccess: isSingleRoleDetailsSuccess } =
    useGetSingleRoleDetailsQuery(roleId, {
      skip: type !== "updateRole",
    });

  // update domian toolkit api
  const [
    updateRole,
    {
      isLoading: isUpdateRoleLoading,
      isError: isUpdateRoleError,
      isSuccess: isUpdateRoleSuccess,
    },
  ] = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Role>({
    defaultValues: {
      role: "",
    },
  });

  // create / update title handler
  const onSubmit: SubmitHandler<Role> = async (roleDetails) => {
    const roleDetailsWithCreatorId = {
      ...roleDetails,
      creatorId: loggedInUserId,
    };

    try {
      //create title function
      if (type === "createRole") {
        await createRole(roleDetailsWithCreatorId).unwrap();
        if (isCreateRoleError) return new Error("Role updating error");
        toast.success("Role created successfully.");
      }
      //update title function
      if (type === "updateRole") {
        await updateRole({ roleId, roleDetailsWithCreatorId }).unwrap();
        if (isUpdateRoleError) return new Error("Title updating error");
        toast.success("Role updated successfully");
      }

      router.push(`/${loggedInUserRole}/view/role`);
    } catch (error: any) {
      console.log("ROLE_ERROR", error);
      toast.error(error.data.message);
    }
  };

  //setting the roles values to the input fields for update case
  useEffect(() => {
    if (type === "updateRole" && isSingleRoleDetailsSuccess && role) {
      reset(role);
    }
  }, [type, isSingleRoleDetailsSuccess, role, reset]);
  return (
    <>
      <form
        className="px-4 space-y-4 w-full max-w-large mx-auto h-[calc(100vh-17rem)]"
        onSubmit={handleSubmit(onSubmit)}
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <Input
          {...register("role", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Title cannot be empty or whitespace",
          })}
          error={errors.role?.message}
          id="role"
          type="text"
          label="Role"
        />

        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isCreateRoleLoading || isUpdateRoleLoading}
            isCreateMode={type === "createRole"}
          />
        </div>
      </form>
    </>
  );
};

export default RoleForm;
