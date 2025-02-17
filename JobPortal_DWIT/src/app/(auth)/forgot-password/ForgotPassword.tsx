"use client";

import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/components/ui/Input";

import { useForgotPasswordMutation } from "@/lib/store/features/authenticationApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Link from "next/link";

interface Form {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter();

  const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  // create / update title handler
  const onSubmit: SubmitHandler<Form> = async (userEmail) => {
    try {
      // login here
      const res: any = await forgotPassword(userEmail);

      if (res.error) {
        toast.info("Failed to send the reset link");
        return;
      }
      toast.success("Reset link sent on your registered email.");
      router.push("/");
    } catch (error: any) {
      console.log("ROLE_ERROR", error);
    }
  };

  return (
    <div
      className="max-w-[27rem] mx-4 w-full bg-white rounded-md"
      data-aos="zoom-in"
    >
      <form className="w-full p-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Link href="/">
            <Image
              src="/images/DWJ.png"
              width={200}
              height={100}
              className="mx-auto mb-1"
              alt="jobslogo"
            />
          </Link>
          <h1 className="text-center font-semibold text-xl text-gray-900 mb-2">
            Forgot Password
          </h1>
        </div>

        <Input
          {...register("email", {
            required: "Required.",
            validate: (value) =>
              value.trim() !== "" || "Email cannot be empty or whitespace",
          })}
          error={errors.email?.message}
          id="email"
          type="text"
          label="Email"
        />

        <button
          disabled={isForgotPasswordLoading}
          type="submit"
          className={` bg-custom-blue hover:bg-hover-blue font-bold text-white h-10 w-full rounded-md flex items-center justify-center 
            ${isForgotPasswordLoading && "cursor-not-allowed"}
            `}
        >
          {isForgotPasswordLoading ? (
            <span className="button-loader"></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
