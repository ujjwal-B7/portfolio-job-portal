import JobForm from "@/components/adminAndCompany/forms/JobForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add job",
};

const AddJobPage = () => {
  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full  max-w-[1159px] mx-auto px-4">
          Add Job{" "}
        </h1>
        <div className="flex lg:flex-row flex-col-reverse gap-5 pt-6 border-[#0F5288] border-t-2">
          <JobForm type="createJob" />
        </div>
      </div>
    </>
  );
};

export default AddJobPage;
