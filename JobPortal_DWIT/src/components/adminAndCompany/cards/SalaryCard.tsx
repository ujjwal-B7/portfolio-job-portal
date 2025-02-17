import { Salary } from "@/lib/types";
import Link from "next/link";

import { useDeleteSalaryMutation } from "@/lib/store/features/salaryApi";
import { toast } from "react-toastify";

import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { PopupModal } from "@/components/modal/PopupModal";

interface SalaryCardProps {
  salary: Salary;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const SalaryCard = ({
  salary,
  index,
  currentPage,
  dataPerPage,
}: SalaryCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const { role } = useSelector((state: RootState) => state.authenticated);

  const [openModal, setOpenModal] = useToggle();

  const [deleteSalary, { isLoading: isDeleteSalaryLoading }] =
    useDeleteSalaryMutation();

  //delete job here
  const handleDeleteSalary = async () => {
    try {
      await deleteSalary(salary._id);
      toast.success("Salary deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("SALARY_DELETION_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={salary._id}
        className={`border text-center w-full
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2 w-full">
          <p className="truncate">{salary.salary}</p>
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
              href={`/${role}/update/salary/${salary._id}`}
              className=" hover:bg-[#3573A3] hover:text-white text-[#3573A3] font-bold py-2 px-4 rounded border-2 border-[#3573A3]"
            >
              Update
            </Link>
          </div>
        </td>
      </tr>

      {/* Salary delete modal */}
      <PopupModal
        type="delete"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={salary.salary}
        handleFunction={handleDeleteSalary}
        isLoading={isDeleteSalaryLoading}
      />
    </>
  );
};

export default SalaryCard;
