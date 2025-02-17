import { OpenToWork } from "@/lib/types";

import { useMarkEmployeeAsRespondedMutation } from "@/lib/store/features/openToWorkApi";
import { toast } from "react-toastify";
import { CircleCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import useToggle from "@/hooks/useToggle";
import { PopupModal } from "@/components/modal/PopupModal";

interface OpenToWorkCardProps {
  openToWork: OpenToWork;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const OpenToWorkCard = ({
  openToWork,
  index,
  currentPage,
  dataPerPage,
}: OpenToWorkCardProps) => {
  const pathname = usePathname();
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const [openModal, setOpenModal] = useToggle();

  const [markEmployeeAsResponded, { isLoading }] =
    useMarkEmployeeAsRespondedMutation();

  //delete job here
  const handleRespondFunction = async () => {
    try {
      const { data } = await markEmployeeAsResponded(openToWork._id);
      if (data?.success) {
        toast.success("Marked as responded.");
        setOpenModal();
      }
    } catch (error) {
      toast.error("Internal server error.");
      console.log("OPEN_TO_WORK_UPDATE_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={openToWork._id}
        className={`border text-left w-full
        }`}
      >
        <td className="px-6 py-4">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate capitalize">{openToWork.job_title}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate capitalize">{openToWork.employee_name}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate ">{openToWork.email}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate ">{openToWork.contact_number}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate capitalize">{openToWork.salary}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate capitalize">{openToWork.degree}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate ">{openToWork.experience}</p>
        </td>
        <td className="px-6 py-4 ">
          <p className="truncate capitalize">
            {openToWork.skills_array.map((skill: string) => (
              <>
                <span className="pl-1">{skill}</span>,
              </>
            ))}
          </p>
        </td>
        {pathname.split("/").pop() === "openToWork" && (
          <td className="px-4 py-3 text-center">
            <button
              className=" hover:bg-[#3573A3] hover:text-white text-[#3573A3] font-bold py-1.5 px-4 rounded border-2 border-[#3573A3] flex items-center gap-2 text-nowrap text-sm"
              onClick={setOpenModal}
            >
              <CircleCheck className="size-5" />
              Mark as responded
            </button>
          </td>
        )}
      </tr>

      {/* respond modal */}
      <PopupModal
        type="respond"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={openToWork.employee_name}
        handleFunction={handleRespondFunction}
        isLoading={isLoading}
      />
    </>
  );
};

export default OpenToWorkCard;
