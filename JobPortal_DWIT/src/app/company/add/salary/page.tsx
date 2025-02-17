import SalaryForm from "@/components/adminAndCompany/forms/SalaryForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add salary",
};

const SalaryAddPage = () => {
  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md ">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
          Add Salary{" "}
        </h1>
        <div className="pt-6">
          <SalaryForm type="createSalary" />
        </div>
      </div>
    </>
  );
};

export default SalaryAddPage;
