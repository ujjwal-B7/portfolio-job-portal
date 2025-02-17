"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import { useResetPasswordMutation } from "@/lib/store/features/authenticationApi";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";
import useToggle from "@/hooks/useToggle";

interface Form {
  new_password: string;
  confirm_new_password: string;
}

const ResetPassword = ({ params }: { params: { token: string } }) => {
  const { token } = params;
  const router = useRouter();
  const [togglePassword, setTogglePassword] = useToggle();
  const [resetPassword] = useResetPasswordMutation();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
    },
  });

  //reset password handler
  const onSubmit: SubmitHandler<Form> = async (passwords) => {
    const { new_password, confirm_new_password } = passwords;
    if (new_password !== confirm_new_password) {
      setError("confirm_new_password", {
        type: "manual",
        message: "Passwords does not match",
      });
      return;
    }

    const res: any = await resetPassword({ passwords, token });

    if (res.error) {
      setError("confirm_new_password", {
        type: "manual",
        message: res.error.data.message,
      });
      return;
    }

    toast.success("Password reset successfull");
    router.push("/");
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
            Reset password
          </h1>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              {...register("new_password", {
                required: "Required.",
                validate: (value) => {
                  if (
                    !value ||
                    value.length < 8 ||
                    value.length > 20 ||
                    !value.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/)
                  ) {
                    return "Password must be between 8 and 20 character with at least one special character and must not contain whitespaces.";
                  }
                },
              })}
              error={errors.new_password?.message}
              id="new_password"
              type={togglePassword ? "text" : "password"}
              label="New Password"
            />
            {togglePassword ? (
              <EyeOff
                className="absolute right-2 top-9 w-5 h-5 cursor-pointer"
                onClick={setTogglePassword}
              />
            ) : (
              <Eye
                className="absolute right-2 top-9 w-5 h-5 cursor-pointer"
                onClick={setTogglePassword}
              />
            )}
          </div>
          <div className="relative">
            <Input
              {...register("confirm_new_password", {
                required: "Required.",
                validate: (value) => {
                  if (
                    !value ||
                    value.length < 8 ||
                    value.length > 20 ||
                    !value.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/)
                  ) {
                    return "Password must be between 8 and 20 character with at least one special character and must not contain whitespaces.";
                  }
                },
              })}
              error={errors.confirm_new_password?.message}
              id="confirm_new_password"
              type={togglePassword ? "text" : "password"}
              label="Confirm Password"
            />
            {togglePassword ? (
              <EyeOff
                className="absolute right-2 top-9 w-5 h-5 cursor-pointer"
                onClick={setTogglePassword}
              />
            ) : (
              <Eye
                className="absolute right-2 top-9 w-5 h-5 cursor-pointer"
                onClick={setTogglePassword}
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className=" bg-custom-blue hover:bg-hover-blue font-bold text-white py-2 w-full rounded-md"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
