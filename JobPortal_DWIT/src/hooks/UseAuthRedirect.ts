"use client";

import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const UseAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const loggedInUserData = useSelector(
    (state: RootState) => state.authenticated
  );
  const { loggedInUserToken, role } = loggedInUserData;

  useEffect(() => {
    const allowedPaths = [
      "/admin/login",
      "/company/login",
      "/company/register",
      "/employee/login",
      "/employee/register",
    ];

    if (!loggedInUserToken) {
      if (allowedPaths.includes(pathname)) {
        return router.push(pathname);
      }
      if (pathname.startsWith("/company") || pathname.startsWith("/admin"))
        return router.push("/");
      return router.push(pathname);
    }

    // If logged in, check role and handle redirection
    if (loggedInUserToken) {
      if (role === "admin") {
        if (!pathname.startsWith("/admin")) {
          return router.push("/admin");
        }
      } else if (role === "company") {
        if (!pathname.startsWith("/company")) {
          return router.push("/company");
        }
      } else if (role === "employee") {
        if (pathname.startsWith("/admin") || pathname.startsWith("/company")) {
          return router.push("/");
        }
      }
    }
  }, [loggedInUserToken, role, router, pathname]);
};

export default UseAuthRedirect;
