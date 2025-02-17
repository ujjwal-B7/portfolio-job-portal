"use client";

import Image from "next/image";
import Link from "next/link";

import { useRef, useEffect } from "react";

import { AlignLeft, Lock } from "lucide-react";

import { LogOut, UserRound } from "lucide-react";

import { logout } from "@/lib/store/slice/authenticatedSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { usePathname } from "next/navigation";
import SideNav from "@/components/adminAndCompany/navigation/SideNav";
import { RootState } from "@/lib/store/store";

import { useGetSingleProfileDetailsByCreatorIdQuery } from "@/lib/store/features/profileApi";
import useToggle from "@/hooks/useToggle";

const TopNav = () => {
  const dispatch = useDispatch();
  const { role, loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  const [
    showUserDropwdownOption,
    setShowUserDropdownOption,
    setCloseDropdownOption,
  ] = useToggle();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLButtonElement>(null);
  const [toggleSidebar, setToggleSidebar, setCloseSidebar] = useToggle();
  const { name, email } = useSelector(
    (state: RootState) => state.authenticated
  );

  const pathname = usePathname();

  //toggling the sidebar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target)
      ) {
        setCloseDropdownOption();
      }
      if (sidebarRef.current && !sidebarRef.current.contains(target)) {
        setCloseSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [profileDropdownRef, sidebarRef, setCloseSidebar, setCloseDropdownOption]);

  const { data: profile, isLoading: isProfileLoading } =
    useGetSingleProfileDetailsByCreatorIdQuery(loggedInUserId, {
      skip: role !== "company",
    });

  return (
    <>
      {toggleSidebar && (
        <div className="fixed inset-0 bg-black/40 z-[1000] transition-all"></div>
      )}
      <div
        ref={sidebarRef}
        className={`fixed z-[1000] inset-y-0 transition-all  ${
          toggleSidebar ? "left-0" : "-left-80"
        }`}
      >
        <SideNav />
      </div>
      <nav className="w-full h-16 sticky top-0 bg-white shadow_div flex justify-between items-center px-5 z-50 font-switzer-regular">
        <button onClick={setToggleSidebar}>
          <AlignLeft size={30} className="primary-text md:hidden text-3xl" />
        </button>
        <button
          ref={profileDropdownRef}
          data-aos="zoom-in"
          className="w-11 h-11 rounded-full bg-gray-100 relative"
          onClick={setShowUserDropdownOption}
        >
          {role === "admin" ? (
            "A"
          ) : (
            <>
              {profile ? (
                <Image
                  fill
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile?.logo}`}
                  alt={profile?.name}
                  className="object-cover rounded-full"
                />
              ) : (
                "C"
              )}
            </>
          )}
          {/* user dropdown */}
          {showUserDropwdownOption && (
            <div className="bg-white shadow_div min-w-56 absolute right-0 top-[55px] text-gray-500 flex flex-col px-2 py-1 zoom-in">
              <div className="text-start">
                <h1 className="capitalize">{name}</h1>
                <span className="text-sm">{email}</span>
              </div>
              <hr className="my-1" />
              <Link
                href="/update-password"
                className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
              >
                <Lock />
                <button className="py-2">Update Password</button>
              </Link>
              {role === "company" && (
                <>
                  <hr className="my-1" />
                  <Link
                    href={`/${pathname.split("/")[1]}/company-profile`}
                    className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
                  >
                    <UserRound />
                    <span className="py-2">Profile</span>
                  </Link>
                </>
              )}
              <hr className="my-1" />
              <div
                className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
                onClick={() => {
                  dispatch(logout());
                  toast.success("Logged out successfully");
                }}
              >
                <LogOut />
                <button className="py-2">Sign out</button>
              </div>
            </div>
          )}
        </button>
      </nav>
    </>
  );
};

export default TopNav;
