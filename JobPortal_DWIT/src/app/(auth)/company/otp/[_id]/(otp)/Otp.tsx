"use client";

import Input from "@/components/ui/Input";
import { useVerifyOtpMutation } from "@/lib/store/features/authenticationApi";

import { LockKeyholeOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  setName,
  setEmail,
  setRole,
  setLoggedInUserToken,
  setLoggedInUserId,
  setAddress,
} from "@/lib/store/slice/authenticatedSlice";
import { useDispatch } from "react-redux";

interface Form {
  otp: string;
}

const OtpVerificationPage = ({ params }: { params: { _id: string } }) => {
  const { _id } = params;
  const dispatch = useDispatch();
  const router = useRouter();
  const [id, setId] = useState(_id);

  const [verifyOtp, { isLoading: isOtpVerificationLoading }] =
    useVerifyOtpMutation();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  //reset password handler
  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      const res: any = await verifyOtp({ data, _id: id });

      if (res?.error) {
        setError("otp", {
          type: "manual",
          message: res?.error?.data?.message,
        });
        setTimeout(() => {
          setError("otp", {
            type: "manual",
            message: "",
          });
        }, 4000);
        return;
      }

      var { _id, name, email, role, address } = res?.data?.user;

      if (res?.data?.success) {
        dispatch(setLoggedInUserId(_id));
        dispatch(setName(name));
        dispatch(setEmail(email));
        dispatch(setAddress(address));
        dispatch(setRole(role));
        dispatch(setLoggedInUserToken(res.data.token));
      }
      toast.success("Otp verified. Company registered successfully.");
      router.push("/company");
    } catch (error) {
      toast.warn("Internal server error.");
      console.log("OTP_VERIFICATION_ERROR", error);
    }
  };

  useEffect(() => {
    setId(_id); // Set the state when the component mounts
  }, [_id]);
  return (
    <div
      className="max-w-[27rem] mx-4 w-full bg-white rounded-md"
      data-aos="zoom-in"
    >
      <form className="w-full p-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <LockKeyholeOpen className="mx-auto w-9 h-9 mb-1" />
          <h1 className="text-center font-semibold text-xl text-gray-900 mb-2">
            OTP Verification
            <span className="block text-sm font-normal text-gray-400">
              We have sent you a otp in your email.
            </span>
          </h1>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              {...register("otp", {
                required: "Required.",
                validate: (value) => {
                  if (!value || value.length !== 6) {
                    return "Otp should contain 6 digits.";
                  }
                },
              })}
              error={errors.otp?.message}
              id="otp"
              type="number"
              label="Enter your otp"
            />
          </div>
        </div>
        <button
          disabled={isOtpVerificationLoading}
          type="submit"
          className={`bg-custom-blue hover:bg-hover-blue font-bold text-white h-10 w-full rounded-md flex items-center justify-center
            ${isOtpVerificationLoading && "cursor-not-allowed"}
            `}
        >
          {isOtpVerificationLoading ? (
            <span className="button-loader"></span>
          ) : (
            "Confirm"
          )}
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationPage;
