import { useVerifySingleCompanyMutation } from "@/lib/store/features/registeredCompaniesApi";
import { RegisteredCompanies } from "@/lib/types";
import { toast } from "react-toastify";
export const sendCompanyAcceptedOrRejectedEmail = async (
  status: string,
  company: RegisteredCompanies,
  verifySingleCompany: ReturnType<typeof useVerifySingleCompanyMutation>[0]
) => {
  try {
    const companyDetails = {
      companyName: company.name,
      companyEmail: company.email,
      customCompanyStatus: status,
    };

    const res = await verifySingleCompany({
      companyId: company._id,
      companyDetails,
    }).unwrap();

    toast.success(
      `${
        company.name.charAt(0).toUpperCase() + company.name.slice(1)
      } is ${status} successfully.`
    );
  } catch (error) {
    console.log("COMPANY_VERIFY_ERROR", error);
  }
};
