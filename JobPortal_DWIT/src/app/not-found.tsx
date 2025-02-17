import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-[#444444]">
      <div className="space-y-2 text-center">
        <h1 className="text-[150px] font-semibold">404</h1>
        <p className="text-xl font-semibold">Not Found</p>
        <p>The resource requested count not be found on this server!</p>
        <button className="bg-custom-blue rounded-md px-4 py-2 text-white mt-6">
          <Link href="/">Home page</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
