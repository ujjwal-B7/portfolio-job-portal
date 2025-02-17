import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/store/slice/authenticatedSlice";
import { RootState } from "@/lib/store/store";
import { LogOut, UserRound, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

import Cookies from "js-cookie";

const UserDropdown = () => {
  const dispatch = useDispatch();
  const { name, email, loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  async function handleLogout() {
    dispatch(logout());
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
  }

  return (
    <div className="bg-white shadow_div min-w-56  absolute right-0 top-16 text-gray-500 flex flex-col px-2 py-1 zoom-in">
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
        <button className="py-1">Update Password</button>
      </Link>
      <hr className="my-1" />
      <Link
        href={`/profile/${loggedInUserId}`}
        className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
      >
        <UserRound />
        <span className="py-1">Profile</span>
      </Link>
      <hr className="my-1" />
      <div
        className="flex items-center gap-4 p-1 hover:bg-[#E8EEF3] rounded-md"
        onClick={() => {
          dispatch(logout());
          signOut({ redirect: false });
          toast.success("Logged out successfully");
        }}
      >
        <LogOut />
        <button className="py-1">Sign out</button>
      </div>
    </div>
  );
};

export default UserDropdown;
