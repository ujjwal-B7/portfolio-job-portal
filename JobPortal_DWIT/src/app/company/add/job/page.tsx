import CompanyJobForm from "@/components/company/forms/CompanyJobForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add job",
};

const AddJobPage = () => {
  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 pl-36">
          Add Job{" "}
        </h1>
        <div className="flex lg:flex-row flex-col-reverse gap-5 pt-6 ">
          <CompanyJobForm type="createJob" />
        </div>
      </div>
    </>
  );
};

export default AddJobPage;
