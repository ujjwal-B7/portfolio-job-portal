import { Type } from "@/lib/types";
import Link from "next/link";

import { useDeleteTypeMutation } from "@/lib/store/features/typeApi";
import { toast } from "react-toastify";

import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { PopupModal } from "@/components/modal/PopupModal";

interface TypeCardProps {
  types: Type;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const TypeCard = ({
  types,
  index,
  currentPage,
  dataPerPage,
}: TypeCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const { role } = useSelector((state: RootState) => state.authenticated);

  const [openModal, setOpenModal] = useToggle();

  const [deleteType, { isLoading: isDeleteTypeLoading }] =
    useDeleteTypeMutation();

  //delete job here
  const handleDeleteType = async () => {
    try {
      await deleteType(types._id);
      toast.success("Type deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("TYPE_DELETION_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={types._id}
        className={`border text-center w-full
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2 w-full">
          <p className="truncate">{types.types}</p>
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
              href={`/${role}/update/type/${types._id}`}
              className=" hover:bg-[#3573A3] hover:text-white text-[#3573A3] font-bold py-2 px-4 rounded border-2 border-[#3573A3]"
            >
              Update
            </Link>
          </div>
        </td>
      </tr>

      {/* Type delete modal */}
      <PopupModal
        type="delete"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={types.types}
        handleFunction={handleDeleteType}
        isLoading={isDeleteTypeLoading}
      />
    </>
  );
};

export default TypeCard;
