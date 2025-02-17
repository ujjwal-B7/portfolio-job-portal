import SalaryForm from "@/components/adminAndCompany/forms/SalaryForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add salary",
};

const SalaryAddPage = () => {
  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md ">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full  pl-6 max-w-screen-lg mx-auto">
          Add Salary{" "}
        </h1>
        <div className="pt-6 border-[#0F5288] border-t-2">
          <SalaryForm type="createSalary" />
        </div>
      </div>
    </>
  );
};

export default SalaryAddPage;
