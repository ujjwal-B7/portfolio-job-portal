import { Technology } from "@/lib/types";
import Link from "next/link";

import { useDeleteTechnologyMutation } from "@/lib/store/features/technologyApi";

import { toast } from "react-toastify";

import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { PopupModal } from "@/components/modal/PopupModal";

interface TechnologyCardProps {
  technology: Technology;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const TechnologyCard = ({
  technology,
  index,
  currentPage,
  dataPerPage,
}: TechnologyCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);
  const { role } = useSelector((state: RootState) => state.authenticated);

  const [openModal, setOpenModal] = useToggle();

  const [deleteTechnology, { isLoading: isDeleteTechnologyLoading }] =
    useDeleteTechnologyMutation();

  //delete technology here
  const handleDeleteTechnology = async () => {
    try {
      await deleteTechnology(technology._id);
      toast.success("Technology deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("TECHNOLOGY_DELETION_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={technology._id}
        className={`border text-center w-full
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2 w-full">
          <p className="truncate">{technology.technology}</p>
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
              href={`/${role}/update/technology/${technology._id}`}
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
        displayName={technology.technology}
        handleFunction={handleDeleteTechnology}
        isLoading={isDeleteTechnologyLoading}
      />
    </>
  );
};

export default TechnologyCard;
