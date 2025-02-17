import TitleForm from "@/components/adminAndCompany/forms/TitleForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add title",
};

const TitleAddPage = () => {
  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md ">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full  pl-6 max-w-screen-lg mx-auto">
          Add Title{" "}
        </h1>
        <div className="pt-6 border-[#0F5288] border-t-2">
          <TitleForm type="createTitle" />
        </div>
      </div>
    </>
  );
};

export default TitleAddPage;
