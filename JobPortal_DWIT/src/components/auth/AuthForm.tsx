"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/Input";

import {
  useEmployeeAuthThroughGoogleMutation,
  useUserLoginMutation,
  useUserRegisterMutation,
} from "@/lib/store/features/authenticationApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setEmail,
  setRole,
  setContactNumber,
  setAddress,
  setLoggedInUserToken,
  setLoggedInUserId,
} from "@/lib/store/slice/authenticatedSlice";
import { RootState } from "@/lib/store/store";
import { useCallback, useEffect, useRef, useState } from "react";
import UseAuthRedirect from "@/hooks/UseAuthRedirect";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";

import Image from "next/image";
import useToggle from "@/hooks/useToggle";

import {
  signIn,
  signOut,
  useSession,
  getProviders,
  ClientSafeProvider,
  getSession,
} from "next-auth/react";

interface AuthFormProps {
  type: string;
  authenticateAs: string;
}

interface Form {
  name?: string;
  email: string;
  contact_number?: string;
  password: string;
}

const AuthForm = ({ type, authenticateAs }: AuthFormProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loggedInUserToken, role } = useSelector(
    (state: RootState) => state.authenticated
  );

  const [togglePassword, setTogglePassword] = useToggle();
  const [loginResponseError, setLoginResponseError] = useState<string>("");

  // redirecting to the respective dashboards as employee/user/admin are already logged in
  // UseAuthRedirect();

  const [userLogin, { isLoading: isUserLoginLoading }] = useUserLoginMutation();
  const [userRegister, { isLoading: isUserRegisterLoading }] =
    useUserRegisterMutation();
  const [employeeAuthThroughGoogle] = useEmployeeAuthThroughGoogleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact_number: "",
    },
  });

  const redirectUser = useCallback(
    (role: string | null) => {
      if (role === "employee") {
        router.push("/");
      } else if (role === "company") {
        router.push("/company");
      } else if (role === "admin") {
        router.push("/admin");
      }
    },
    [router]
  );

  // create / update title handler
  const onSubmit: SubmitHandler<Form> = async (userDetails) => {
    try {
      // login here
      if (type === "login") {
        const res: any = await userLogin({ ...userDetails, authenticateAs });

        if (res?.error) {
          setLoginResponseError(res.error?.data?.message);
          setTimeout(() => {
            setLoginResponseError("");
          }, 4000);
          toast.info(res.error.data.message);
          return;
        }

        var { _id, name, email, role, contact_number, address } = res.data.user;

        if (res.data.success) {
          dispatch(setLoggedInUserId(_id));
          dispatch(setName(name));
          dispatch(setEmail(email));
          dispatch(setContactNumber(contact_number));
          dispatch(setRole(role));
          dispatch(setAddress(address));
          dispatch(setLoggedInUserToken(res.data.token));
        }
        toast.success("Logged in successfully");
        redirectUser(role);
      }

      if (type === "register") {
        const res: any = await userRegister(userDetails);

        if (res?.error) {
          setLoginResponseError(res.error?.data?.message);
          setTimeout(() => {
            setLoginResponseError("");
          }, 4000);
          toast.info(res.error.data.message);
          return;
        }

        var { _id, name, email, role, contact_number } = res.data.user;

        if (res.data.success) {
          dispatch(setLoggedInUserId(_id));
          dispatch(setName(name));
          dispatch(setEmail(email));
          dispatch(setContactNumber(contact_number));
          dispatch(setRole(role));
          dispatch(setLoggedInUserToken(res.data.token));
        }
        toast.success(
          `${
            role.charAt(0).toUpperCase() + role.slice(1)
          } registered successfully`
        );
      }

      redirectUser(role);
    } catch (error: any) {
      console.log("ROLE_ERROR", error.data.error);
    }
  };

  const { data: session } = useSession();

  // accessing the user details from google and requesting backend for token and user from database and persisting in cookie
  useEffect(() => {
    (async function () {
      if (session?.user && !loggedInUserToken) {
        const { data } = await employeeAuthThroughGoogle({
          email: session?.user?.email,
          name: session?.user?.name,
        });

        const { success, token, user } = data;
        if (success) {
          dispatch(setName(user?.name));
          dispatch(setEmail(user?.email));
          dispatch(setRole(user?.role));
          dispatch(setLoggedInUserId(user?._id));
          dispatch(setLoggedInUserToken(token));
          toast.success("Employee logged in successfully.");
          router.push("/");
        }
      }
    })();
  }, [session, loggedInUserToken, dispatch, router, employeeAuthThroughGoogle]);

  //if user is already logged in, then cannot navigate to the auth form..so if token then redirecting to the respective dashboard from where they have requested
  useEffect(() => {
    if (loggedInUserToken) {
      redirectUser(role);
    }
  }, [loggedInUserToken, role, redirectUser]);

  return (
    <div
      className="max-w-[27rem] mx-4 w-full bg-white rounded-md"
      data-aos="zoom-in"
    >
      <form
        className="w-full px-8 py-6 space-y-4 font-switzer-regular"
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
          {/* <h1 className="text-center font-semibold text-xl text-gray-900 mb-4">
            {type === "register" ? "Register" : "Login"}
          </h1> */}
        </div>
        {loginResponseError && (
          <p className="text-danger text-sm">{loginResponseError}</p>
        )}
        {type === "register" && (
          <Input
            {...register("name", {
              required: "Required.",
              validate: (value) =>
                value.trim() !== "" || "Name cannot be empty or whitespace",
            })}
            error={errors.name?.message}
            id="name"
            type="text"
            label="Name"
          />
        )}
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
        {type === "register" && (
          <Input
            {...register("contact_number", {
              required: "Required.",
              validate: (value) =>
                value.trim().length === 10 ||
                "Contact number must be exactly 10 digits",
            })}
            error={errors.contact_number?.message}
            id="contact_number"
            type="text"
            label="Contact Number"
            numeric={true}
          />
        )}

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
                className="absolute right-4 top-[2.4rem] size-[0.9rem] cursor-pointer"
                onClick={setTogglePassword}
              />
            ) : (
              <EyeOff
                className="absolute right-4 top-[2.4rem] size-[0.9rem] cursor-pointer"
                onClick={setTogglePassword}
              />
            )}
          </div>
          {authenticateAs !== "admin" && type !== "register" && (
            <div className="text-end my-1.5">
              <Link
                href="/forgot-password"
                className="cursor-pointer w-fit text-sm hover:underline text-hover-blue"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>
        <button
          disabled={isUserLoginLoading || isUserRegisterLoading}
          type="submit"
          className={`bg-custom-blue hover:bg-hover-blue font-bold text-white h-10 w-full rounded-md flex items-center justify-center ${
            (isUserLoginLoading || isUserRegisterLoading) &&
            "cursor-not-allowed"
          }`}
        >
          {isUserLoginLoading || isUserRegisterLoading ? (
            <span className="button-loader"></span>
          ) : (
            <p>{type === "register" ? "Register" : "Login"}</p>
          )}
        </button>

        {authenticateAs === "employee" && (
          <>
            <div className="flex gap-4 items-center justify-center text-sm text-gray-500">
              <hr className="flex-1" />
              or
              <hr className="flex-1" />
            </div>
            <div
              className="flex gap-2 items-center justify-center w-full py-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
              onClick={() => signIn("google", { redirect: false })}
            >
              <svg
                width="20px"
                height="20px"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              <span className="text-sm text-gray-900 tracking-wide">
                Continue with Google
              </span>
            </div>
          </>
        )}

        {authenticateAs !== "admin" && type !== "register" && (
          <p className="text-sm text-center">
            Dont have an account?{" "}
            <Link
              className="text-zinc-500 hover:text-custom-blue hover:underline"
              href={`/${authenticateAs}/register`}
            >
              Register
            </Link>
          </p>
        )}
        {authenticateAs !== "admin" && type !== "login" && (
          <p className="text-sm text-center text-gray-900 ">
            Already have an account?{" "}
            <Link
              className="text-zinc-500 hover:underline"
              href={`/${authenticateAs}/login`}
            >
              Login instead
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
