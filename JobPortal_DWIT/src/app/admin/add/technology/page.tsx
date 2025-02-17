import TechnologyForm from "@/components/adminAndCompany/forms/TechnologyForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add technology",
};

const TechnologyAddPage = () => {
  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md ">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full  pl-6 max-w-screen-lg mx-auto">
          Add Technology{" "}
        </h1>
        <div className="pt-6 border-[#0F5288] border-t-2">
          <TechnologyForm type="createTechnology" />
        </div>
      </div>
    </>
  );
};

export default TechnologyAddPage;
