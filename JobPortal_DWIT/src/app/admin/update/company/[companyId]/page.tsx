import CompanyForm from "@/components/adminAndCompany/forms/CompanyForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update company",
};

const CompanyUpdatePage = ({ params }: { params: { companyId: string } }) => {
  const { companyId } = params;

  return (
    <div className="bg-white py-6 mt-10 rounded-md ">
      <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
        Update Company{" "}
      </h1>
      <div className="pt-6">
        <CompanyForm type="updateCompany" companyId={companyId} />
      </div>
    </div>
  );
};

export default CompanyUpdatePage;
