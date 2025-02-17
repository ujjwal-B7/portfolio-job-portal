import { Company } from "@/lib/types";
import Link from "next/link";

import { useDeleteCompanyMutation } from "@/lib/store/features/companyApi";

import { toast } from "react-toastify";
import Image from "next/image";
import useToggle from "@/hooks/useToggle";
import { PopupModal } from "@/components/modal/PopupModal";

interface AdminCardProps {
  company: Company;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const CompanyCard = ({
  company,
  index,
  currentPage,
  dataPerPage,
}: AdminCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const [openModal, setOpenModal] = useToggle();
  const [showFullCompanyDescription, setShowFullCompanyDescription] =
    useToggle();
  const [deleteCompany, { isLoading: isDeleteCompanyLoading }] =
    useDeleteCompanyMutation();

  //delete companies here
  const handleDeleteCompany = async () => {
    try {
      await deleteCompany(company._id);
      toast.success("Company deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("COMPANY_DELETION_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={company._id}
        className={`border text-left w-full
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2">
          <p className="truncate">{company.company}</p>
        </td>
        <td className="px-4 py-4 text-justify">
          <p className="xl:w-full w-80">
            {showFullCompanyDescription
              ? company.description
              : `${company.description.substring(0, 300)}`}
            {showFullCompanyDescription === false &&
            company.description.length > 300
              ? " ...."
              : ""}
          </p>
          {company.description.length > 300 && (
            <div className="text-end">
              <button
                className="text-custom-blue underline text-sm"
                onClick={setShowFullCompanyDescription}
              >
                {showFullCompanyDescription ? "Hide" : "Show more"}
              </button>
            </div>
          )}
        </td>
        <td className="px-4 py-2">
          <Image
            // src={company.logo}
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company.logo}`}
            width={80}
            height={40}
            alt="company-logo"
          />
        </td>
        <td className="px-4 py-2 text-center">
          <div className="flex justify-center space-x-4">
            <button
              className=" hover:bg-danger hover:text-white text-danger font-bold py-2 px-4 rounded border-2 border-danger"
              onClick={setOpenModal}
            >
              Delete
            </button>
            <Link
              href={`/admin/update/company/${company._id}`}
              className=" hover:bg-[#3573A3] hover:text-white text-[#3573A3] font-bold py-2 px-4 rounded border-2 border-[#3573A3]"
            >
              Update
            </Link>
          </div>
        </td>
      </tr>

      {/* Title delete modal */}
      <PopupModal
        type="delete"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={company.company}
        handleFunction={handleDeleteCompany}
        isLoading={isDeleteCompanyLoading}
      />
    </>
  );
};

export default CompanyCard;
