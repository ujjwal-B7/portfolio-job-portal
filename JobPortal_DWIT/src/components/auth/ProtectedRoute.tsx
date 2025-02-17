"use client";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: string;
  isLoading: boolean;
}

const ProtectedRoute = ({ children, role, isLoading }: ProtectedRouteProps) => {
  const router = useRouter();
  const { loggedInUserToken, role: loggedInUserRole } = useSelector(
    (state: RootState) => state.authenticated
  );

  // Conditionally render the layout only if the user is authenticated
  if (!loggedInUserToken || loggedInUserRole !== role) {
    router.push("/");
    return;
  }

  return !isLoading && children;
};

export default ProtectedRoute;
