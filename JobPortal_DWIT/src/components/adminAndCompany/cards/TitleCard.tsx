import { Title } from "@/lib/types";
import Link from "next/link";

import { useDeleteTitleMutation } from "@/lib/store/features/titleApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import useToggle from "@/hooks/useToggle";
import { PopupModal } from "@/components/modal/PopupModal";

interface TitleCardProps {
  title: Title;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const TitleCard = ({
  title,
  index,
  currentPage,
  dataPerPage,
}: TitleCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const loggedInUserData = useSelector(
    (state: RootState) => state.authenticated
  );
  const { role } = loggedInUserData;

  const [openModal, setOpenModal] = useToggle();

  const [deleteTitle, { isLoading: isDeleteTitleLoading }] =
    useDeleteTitleMutation();

  //delete job here
  const handleDeleteTitle = async () => {
    try {
      await deleteTitle(title._id);
      toast.success("Title deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("TITLE_DELETION_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={title._id}
        className={`border  w-full
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2 w-full">
          <p className="truncate">{title.title}</p>
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
              href={`/${role}/update/title/${title._id}`}
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
        displayName={title.title}
        handleFunction={handleDeleteTitle}
        isLoading={isDeleteTitleLoading}
      />
    </>
  );
};

export default TitleCard;
