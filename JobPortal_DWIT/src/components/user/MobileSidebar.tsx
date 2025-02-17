import React from "react";

import Image from "next/image";
import Link from "next/link";

import useToggle from "@/hooks/useToggle";
import { LogOut, UserRound, Lock, ChevronDown } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/store/slice/authenticatedSlice";
import { JobFairRegisterButton, NavLinksProps } from "./navigation/Navbar";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

interface MobileSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: () => void;
  mobileMenuRef: any;
  nav_links: NavLinksProps[];
  loggedInUserToken: string | null;
  pathname: string;
  loggedInUserId: string | null;
  profile: any;
  name: string | null;
  email: string | null;
}

const MobileSidebar = ({
  isMobileMenuOpen,
  mobileMenuRef,
  nav_links,
  setIsMobileMenuOpen,
  loggedInUserToken,
  pathname,
  loggedInUserId,
  profile,
  name,
  email,
}: MobileSidebarProps) => {
  const dispatch = useDispatch();
  const [showLoginOptions, setShowLoginOptions] = useToggle();
  const [showRegisterOptions, setShowRegisterOptions] = useToggle();
  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 w-full h-screen bg-black/50 z-40 transition-all"></div>
      )}
      <div
        ref={mobileMenuRef}
        className={`font-switzer-regular mobile_nav shadow-[0_2px_8px_rgba(0,0,0,0.1)] fixed lg:hidden w-72 h-screen z-[1000] top-0 bg-white ease-in  ${
          isMobileMenuOpen ? "left-0" : "-left-72"
        } py-4 px-4`}
      >
        <ul className="space-y-2 text-gray-900 h-full flex flex-col pt-4">
          {nav_links.map((nav_link) => (
            <li key={nav_link.name} onClick={setIsMobileMenuOpen}>
              <Link href={nav_link.link}>
                <div className="flex space-x-2 hover:bg-gray-100 p-2 rounded-md">
                  {/* <div>{nav_link.svg}</div> */}
                  <p className="">{nav_link.name}</p>
                </div>
              </Link>
            </li>
          ))}
          {loggedInUserToken ? (
            <div className="flex flex-col justify-between flex-1">
              <div className="space-y-4">
                <Link
                  onClick={setIsMobileMenuOpen}
                  className={` lg:hover:bg-gray-100 rounded-md py-1 px-2 
                      ${pathname === "/job/applications" && "bg-gray-100"}
                      `}
                  href="/job/applications"
                >
                  Applied Jobs
                </Link>
                <JobFairRegisterButton />
              </div>

              <div className="text-sm">
                <hr className="my-1" />
                <Link
                  href="/update-password"
                  className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
                >
                  <Lock className="size-4" />
                  <button className="py-1">Update Password</button>
                </Link>
                <hr className="my-1" />
                <Link
                  href={`/profile/${loggedInUserId}`}
                  className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
                  onClick={setIsMobileMenuOpen}
                >
                  <UserRound className="size-4" />
                  <span className="py-1">Profile</span>
                </Link>
                <hr className="my-1" />
                <div
                  className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
                  onClick={() => {
                    dispatch(logout());
                    signOut({ redirect: true });
                    toast.success("Logged out successfully");
                  }}
                >
                  <LogOut className="size-4" />
                  <button className="py-1">Sign out</button>
                </div>
                <div className="flex gap-2 mt-5">
                  <button className="w-11 h-11 rounded-full bg-gray-200 relative">
                    {profile ? (
                      <Image
                        fill
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile?.logo}`}
                        alt={profile?.name}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      "U"
                    )}
                  </button>
                  <div className="-space-y-1">
                    <h1 className="capitalize">{name}</h1>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="pl-1">
                <p
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={setShowLoginOptions}
                >
                  Login{" "}
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`size-4 text-gray-900 transition-all ${
                        showLoginOptions ? "-rotate-180" : "rotate-0"
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </p>
                {showLoginOptions && (
                  <div className="bg-gray-100 p-2 space-y-1 mt-1 rounded-md divide-y-2 transition-all">
                    <li>
                      <Link
                        href="/employee/login"
                        className="block hover:bg-white p-2 rounded-md"
                      >
                        As an employee
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/company/login"
                        className="block hover:bg-white p-2 rounded-md"
                      >
                        As a company
                      </Link>
                    </li>
                  </div>
                )}
              </div>
              <div className="pl-1">
                <p
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={setShowRegisterOptions}
                >
                  Register{" "}
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`size-4 text-gray-900 transition-all ${
                        showRegisterOptions ? "-rotate-180" : "rotate-0"
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </p>
                {showRegisterOptions && (
                  <div className="bg-gray-100 p-2 space-y-1 mt-1 rounded-md divide-y-2 transition-all">
                    <li>
                      <Link
                        href="/employee/register"
                        className="block hover:bg-white p-2 rounded-md"
                      >
                        As an employee
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/company/register"
                        className="block hover:bg-white p-2 rounded-md"
                      >
                        As a company
                      </Link>
                    </li>
                  </div>
                )}
              </div>
              <JobFairRegisterButton />
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default MobileSidebar;
