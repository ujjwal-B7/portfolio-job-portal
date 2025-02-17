"use client";

import SideNav from "@/components/adminAndCompany/navigation/SideNav";
import TopNav from "@/components/adminAndCompany/navigation/TopNav";

// import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

import { useGetSingleProfileDetailsByCreatorIdQuery } from "@/lib/store/features/profileApi";

import { usePathname } from "next/navigation";

import { logout } from "@/lib/store/slice/authenticatedSlice";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ShieldEllipsis } from "lucide-react";

interface ErrorData {
  message: string;
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
  } = useGetSingleProfileDetailsByCreatorIdQuery(loggedInUserId);

  if (error && "data" in error) {
    const fetchError = error as FetchBaseQueryError;

    // Check if the data has a message and is of the expected type
    const errorMessage = (fetchError.data as ErrorData)?.message;

    if (
      errorMessage === "Unauthorized" ||
      errorMessage === "Token has expired."
    ) {
      dispatch(logout());
      toast.error(
        errorMessage === "Unauthorized"
          ? "Access Denied. Unauthorized access."
          : "Session has expired."
      );
    }
  }

  return (
    <>
      <ProtectedRoute role="company" isLoading={isProfileLoading}>
        <div className="flex">
          <div className="md:block hidden">
            <SideNav />
          </div>
          <main className="bg-gray-100  md:w-[calc(100%-15rem)] w-full min-h-screen">
            <TopNav />
            <div className="px-5">
              {/* if company dont have activestatus or profile, they can still navigate to profile page for profile creation but navigation to other page is restricted */}
              {(!profile?.creatorId?.is_company_active || !profile) &&
                pathname.includes("/company/company-profile") &&
                children}

              {/* if company has both active status and profile created then they can navigate to every page and perform job creation operations */}
              {!isProfileLoading &&
              profile?.creatorId?.is_company_active &&
              profile ? (
                children
              ) : (
                <>
                  {/* if company is inactive and doesnt have profile and if they try to navigate to profile page then hiding this message while they are in profile page but showing this message when they are in home page */}

                  {!isProfileLoading &&
                    pathname !== "/company/company-profile" && (
                      <div className="flex items-center justify-center h-[80vh]">
                        <div className="space-y-6 bg-white shadow-lg rounded-md px-6 py-10 max-w-[40rem] mx-auto text-center">
                          <ShieldEllipsis className="w-24 h-24 mx-auto text-gray-600" />
                          <h1 className="text-gray-900 text-2xl font-semibold">
                            Account Under Verification
                          </h1>
                          <p className="text-gray-600 font-medium text-sm">
                            Your account is currently under review and
                            verification, which may take up to 24 hours. In the
                            meantime, please complete your company profile to
                            ensure a smooth onboarding process.
                          </p>
                        </div>
                      </div>
                    )}
                </>
              )}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
}
