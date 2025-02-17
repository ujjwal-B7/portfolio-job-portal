import Image from "next/image";
import Link from "next/link";

import { CompaniesStatus } from "@/lib/types";
import { CircleX } from "lucide-react";

import { useVerifySingleCompanyMutation } from "@/lib/store/features/registeredCompaniesApi";

import useToggle from "@/hooks/useToggle";
import { PopupModal } from "@/components/modal/PopupModal";
import { sendCompanyAcceptedOrRejectedEmail } from "@/utils/sendCompanyAcceptedOrRejectedEmail";

const DeactivatedCompaniesCard = ({
  company,
  index,
  currentPage,
  dataPerPage,
}: CompaniesStatus) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const [showPanImageInBigView, setShowPanImageInBigView] = useToggle();
  const [openModal, setOpenModal] = useToggle();

  const [verifySingleCompany, { isLoading: isVerifySingleCompanyLoading }] =
    useVerifySingleCompanyMutation();

  const handleCompanyStatus = async () => {
    await sendCompanyAcceptedOrRejectedEmail(
      "activated",
      company,
      verifySingleCompany
    );
    setOpenModal();
  };

  return (
    <>
      <tr key={company._id} className="text-start border capitalize">
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2">
          <p className="truncate">{company.name}</p>
        </td>
        <td className="px-4 py-2">
          <p className=" truncate normal-case">{company.email}</p>
        </td>
        <td className="px-4 py-2">
          <Link
            href={company.company_website_url}
            target="_blank"
            className=" truncate normal-case text-custom-blue"
          >
            {company.company_website_url || "Not Available"}
          </Link>
        </td>
        <td className="px-4 py-2">
          <p className=" truncate">{company.address}</p>
        </td>
        <td className="px-4 py-2">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company.company_pan_image}`}
            width={80}
            height={40}
            alt="company-logo"
            className="cursor-pointer"
            onClick={setShowPanImageInBigView}
          />
        </td>
        <td className="px-4 py-2 ">
          <p className="truncate">{company.pan_number}</p>
        </td>
        <td className="px-4 py-2 ">
          <p className="truncate">{company.contact_number}</p>
        </td>
        <td className="px-4 py-2">
          <p className=" truncate">{company.company_domain}</p>
        </td>
        <td className="px-4 py-2">
          <p className="truncate capitalize text-danger">
            {company.companyStatus}
          </p>
        </td>
        <td className="px-4 py-2 text-center">
          <div className="flex justify-center space-x-2">
            <button
              className="
                  hover:bg-green-600/90 border-green-600 
               hover:text-white text-green-600 font-bold py-1
                 px-4 text-[#3573A3 rounded border-2"
              onClick={setOpenModal}
            >
              Activate
            </button>
          </div>
        </td>
      </tr>
      {showPanImageInBigView && (
        <div className="w-full h-screen bg-black/40 flex items-center justify-center zoom-out fixed inset-0 z-50">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${company.company_pan_image}`}
            width={500}
            height={700}
            alt="company-logo"
            className="cursor-pointer"
          />
          <CircleX
            className="text-white absolute w-10 h-10 right-5 top-3 cursor-pointer"
            onClick={setShowPanImageInBigView}
          />
        </div>
      )}

      <PopupModal
        type="activate"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={company.name}
        handleFunction={handleCompanyStatus}
        isLoading={isVerifySingleCompanyLoading}
      />
    </>
  );
};

export default DeactivatedCompaniesCard;
