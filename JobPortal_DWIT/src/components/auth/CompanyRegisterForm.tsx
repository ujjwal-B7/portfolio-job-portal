"use client";

import Image from "next/image";

import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/Input";

import {
  useUserLoginMutation,
  useCompanyRegisterMutation,
} from "@/lib/store/features/authenticationApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import UseAuthRedirect from "@/hooks/UseAuthRedirect";
import Link from "next/link";

import { Eye, EyeOff, Camera } from "lucide-react";

import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface CompanyRegisterFormProps {
  type: string;
  authenticateAs: string;
}

interface Form {
  name?: string;
  email: string;
  address?: string;
  company_domain?: string;
  contact_number?: string;
  pan_number?: string;
  company_pan_image?: string;
  company_website_url?: string;
  password: string;
  role: string;
}

const CompanyRegisterForm = ({
  type,
  authenticateAs,
}: CompanyRegisterFormProps) => {
  const router = useRouter();
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const { loggedInUserToken, role } = useSelector(
    (state: RootState) => state.authenticated
  );

  const [togglePassword, setTogglePassword] = useToggle();
  const [loginResponseError, setLoginResponseError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  // redirecting to the respective dashboards as employee/user/admin are already logged in
  // UseAuthRedirect();

  const [userLogin, { isLoading: isUserLoginLoading, error }] =
    useUserLoginMutation();
  const [companyRegister, { isLoading: isUserRegisterLoading }] =
    useCompanyRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Form>({
    defaultValues: {
      name: "",
      email: "",
      address: "",
      company_domain: "",
      contact_number: "",
      pan_number: "",
      company_pan_image: "",
      company_website_url: "",
      password: "",
      role: "",
    },
  });

  // create / update title handler
  const onSubmit: SubmitHandler<Form> = async (userDetails: any) => {
    try {
      const userFormData = new FormData();
      userFormData.set("name", userDetails.name);
      userFormData.set("email", userDetails.email);
      userFormData.set("address", userDetails.address);
      userFormData.set("company_domain", userDetails.company_domain);
      userFormData.set("contact_number", userDetails.contact_number);
      userFormData.set("pan_number", userDetails.pan_number);
      userFormData.set("image", userDetails.company_pan_image);
      userFormData.set("company_website_url", userDetails.company_website_url);
      userFormData.set("password", userDetails.password);
      userFormData.set("role", "company");

      const res: any = await companyRegister(userFormData).unwrap();

      var { _id } = res.user;

      if (res?.success) {
        toast.success("Otp sent to your email.");
        router.push(`/company/otp/${_id}`);
      }
    } catch (error: any) {
      console.error("COMPANY_REGISTER_ERROR", error);
      setLoginResponseError(error?.data?.message);
      setTimeout(() => {
        setLoginResponseError("");
      }, 4000);
      toast.info(error?.data?.message);
      return;
    }
  };

  //if user is already logged in then cannot navigate to the auth form..so if token then redirecting to the respective dashboard from where they have requested
  useEffect(() => {
    if (loggedInUserToken) {
      if (role === "employee") {
        return router.push("/");
      }
      if (role === "company") {
        return router.push("/company");
      }
      if (role === "admin") {
        return router.push("/admin");
      }
    }
  }, [loggedInUserToken, role, router]);

  return (
    <div
      className="max-w-[55rem] mx-4 w-full bg-white rounded-md"
      data-aos="zoom-in"
    >
      <form
        className="w-full p-8 font-switzer-regular"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          {/* <h1 className="text-center font-semibold text-xl text-gray-900 mb-">
            Register as company
          </h1> */}
        </div>
        {loginResponseError && (
          <p className="text-danger text-sm">{loginResponseError}</p>
        )}
        <section className="flex md:flex-row flex-col-reverse gap-[2rem] ">
          <div className="space-y-4 md:w-[70%]">
            <Input
              {...register("name", {
                required: "Required.",
                validate: (value) =>
                  value?.trim() !== "" || "Name cannot be empty or whitespace",
              })}
              error={errors.name?.message}
              id="name"
              type="text"
              label="Name"
            />
            <div className="flex md:flex-row flex-col md:gap-[2rem] gap-4">
              <div className="md:w-2/4">
                <Input
                  {...register("email", {
                    required: "Required.",
                    validate: (value) =>
                      value?.trim() !== "" ||
                      "Email cannot be empty or whitespace",
                  })}
                  error={errors.email?.message}
                  id="email"
                  type="text"
                  label="Email"
                />
              </div>
              <div className="md:w-2/4">
                <Input
                  {...register("address", {
                    required: "Required.",
                    validate: (value) =>
                      value?.trim() !== "" ||
                      "Address cannot be empty or whitespace",
                  })}
                  error={errors.address?.message}
                  id="address"
                  type="text"
                  label="Address"
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col md:gap-[2rem] gap-4">
              <div className="md:w-2/4">
                <Input
                  {...register("contact_number", {
                    required: "Required.",
                    validate: {
                      lengthCheck: (value) =>
                        value?.trim().length === 10 ||
                        "Contact number must be exactly 10 digits",
                    },
                  })}
                  error={errors.contact_number?.message}
                  id="contact_number"
                  type="text"
                  label="Contact Number"
                  numeric={true}
                />
              </div>
              <div className="md:w-2/4">
                <Input
                  {...register("company_website_url", {
                    required: false,
                  })}
                  error={errors.company_website_url?.message}
                  id="company_website_url"
                  type="text"
                  label="Website URL (optional)"
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col md:gap-[2rem] gap-4">
              <div className="md:w-2/4">
                <Input
                  {...register("company_domain", {
                    required: "Required.",
                    validate: (value) =>
                      value?.trim() !== "" ||
                      "Company domain cannot be empty or whitespace",
                  })}
                  error={errors.company_domain?.message}
                  id="company_domain"
                  type="text"
                  label="Company Domain"
                />
              </div>
              <div className="md:w-2/4">
                <Input
                  {...register("pan_number", {
                    required: "Required.",
                    validate: {
                      lengthCheck: (value) =>
                        value?.trim().length === 9 ||
                        "Pan number must be equal to 9 digits",
                    },
                  })}
                  error={errors.pan_number?.message}
                  id="pan_number"
                  type="text"
                  label="Pan Number"
                  numeric={true}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Input
                  {...register("password", {
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
                  error={errors.password?.message}
                  id="password"
                  type={togglePassword ? "text" : "password"}
                  label="Password"
                />
                {togglePassword ? (
                  <Eye
                    className="absolute right-2 top-9 w-5 h-5 cursor-pointer"
                    onClick={setTogglePassword}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-2 top-9 w-5 h-5 cursor-pointer"
                    onClick={setTogglePassword}
                  />
                )}
              </div>
            </div>
            <button
              disabled={isUserRegisterLoading}
              type="submit"
              className={`bg-custom-blue hover:bg-hover-blue font-bold text-white h-10 w-full rounded-md flex items-center justify-center ${
                isUserRegisterLoading && "cursor-not-allowed"
              }`}
            >
              {isUserRegisterLoading ? (
                <span className="button-loader"></span>
              ) : (
                <p>Register</p>
              )}
            </button>
            <p className="text-sm text-center text-gray-900 ">
              Already have an account?{" "}
              <Link
                className="text-zinc-500 hover:text-custom-blue hover:underline"
                href={`/${authenticateAs}/login`}
              >
                Login
              </Link>
            </p>
          </div>
          <div className="flex flex-col items-center md:mt-0 mt-4">
            <label htmlFor="company_pan_image" className="text-4 mb-1">
              Upload Pan Image
            </label>
            <div
              className="relative w-40 h-40 mt-2 cursor-pointer rounded-md border-2 border-gray-200 border-dashed"
              onClick={() => imageUploadRef.current?.click()}
            >
              <Image
                src={selectedImage}
                fill
                alt="preview-image"
                className="rounded-md object-contain"
                onError={() => setSelectedImage("/images/pan.png")}
              />
              <div className="absolute right-0 -bottom-3 z-50">
                <Camera className="text-[#36312F] bg-hover-light shadow-md  rounded-full p-2 w-10 h-10" />
              </div>
              <input
                {...register("company_pan_image", {
                  required: "Required.",
                })}
                id="company_pan_image"
                type="file"
                ref={imageUploadRef}
                className="absolute opacity-0"
                onChange={(e) => {
                  const file: any = e.target.files?.[0];
                  setSelectedImage(URL.createObjectURL(file));
                  setValue("company_pan_image", file);
                }}
              />
            </div>

            <p className="text-red-600 text-sm">
              {errors.company_pan_image?.message}
            </p>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CompanyRegisterForm;
