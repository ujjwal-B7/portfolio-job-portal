import { Domain } from "@/lib/types";
import Link from "next/link";

import { useDeleteDomainMutation } from "@/lib/store/features/domainApi";
import { toast } from "react-toastify";
import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { PopupModal } from "@/components/modal/PopupModal";

interface DomainCardProps {
  domain: Domain;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const DomainCard = ({
  domain,
  index,
  currentPage,
  dataPerPage,
}: DomainCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const { role } = useSelector((state: RootState) => state.authenticated);

  const [openModal, setOpenModal] = useToggle();

  const [deleteDomain, { isLoading: isDeleteDomainLoading }] =
    useDeleteDomainMutation();

  //delete job here
  const handleDeleteDomain = async () => {
    try {
      await deleteDomain(domain._id);
      toast.success("Domain deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("DOMAIN_DELETION_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={domain._id}
        className={`border text-center w-full
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2 w-full">
          <p className="truncate">{domain.domain}</p>
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
              href={`/${role}/update/domain/${domain._id}`}
              className=" hover:bg-[#3573A3] hover:text-white text-[#3573A3] font-bold py-2 px-4 rounded border-2 border-[#3573A3]"
            >
              Update
            </Link>
          </div>
        </td>
      </tr>

      {/* Domain delete modal */}
      <PopupModal
        type="delete"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={domain.domain}
        handleFunction={handleDeleteDomain}
        isLoading={isDeleteDomainLoading}
      />
    </>
  );
};

export default DomainCard;
