"use client";

import React from "react";

import Navbar from "@/components/user/navigation/Navbar";
import Footer from "@/components/user/navigation/Footer";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import { MoveDown } from "lucide-react";

export default function ClientUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { role } = useSelector((state: RootState) => state.authenticated);
  const pathname = usePathname();

  // conditionally rendering the profile page, so that company can visit only the profile of the employee outside their dashboard and except /profile route if they try to navigate to any other page in the user dashboard,redirecting them to their respective dashboards
  if (role === "company" || role === "admin") {
    if (pathname.startsWith("/profile")) {
      return (
        <>
          <main className="min-h-screen font-arial-rounded-regular pb-16">
            {children}
          </main>
        </>
      );
    } else {
      router.push(`/${role}`);
      return;
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen font-arial-rounded-regular pb-16">
        {children}
      </main>
      <a
        href="#top_search"
        className="fixed bottom-5 right-5 shadow-md rounded-lg bg-gray-400 p-2"
      >
        <MoveDown className="text-white rotate-180" />
      </a>
      <Footer />
    </>
  );
}
