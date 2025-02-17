"use client";

import TopNav from "@/components/adminAndCompany/navigation/TopNav";

import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { useDispatch } from "react-redux";

import { logout } from "@/lib/store/slice/authenticatedSlice";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { toast } from "react-toastify";
import { useIsAdminQuery } from "@/lib/store/features/companyApi";
import SideNav from "@/components/adminAndCompany/navigation/SideNav";

interface ErrorData {
  message: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const { isLoading, error } = useIsAdminQuery({}); // dummy endpoint

  if (error && "data" in error) {
    const fetchError = error as FetchBaseQueryError;

    // Check if the data has a message and is of the expected type
    const errorMessage = (fetchError.data as ErrorData)?.message;

    if (errorMessage === "Unauthorized") {
      dispatch(logout());
      toast.error("Access Denied: Unauthorized access.");
    }
  }

  return (
    <>
      <ProtectedRoute role="admin" isLoading={isLoading}>
        <div className="flex font-switzer-regular">
          <div className="md:block hidden">
            <SideNav />
          </div>
          <main className="bg-gray-100  md:w-[calc(100%-15rem)] w-full min-h-screen">
            <TopNav />
            <div className="px-5">{children}</div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
}
