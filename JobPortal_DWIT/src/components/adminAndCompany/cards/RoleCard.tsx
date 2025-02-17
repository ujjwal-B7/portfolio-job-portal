import { Role } from "@/lib/types";
import Link from "next/link";

import { useDeleteRoleMutation } from "@/lib/store/features/roleApi";
import { toast } from "react-toastify";

import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { PopupModal } from "@/components/modal/PopupModal";

interface RoleCardProps {
  role: Role;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const RoleCard = ({ role, index, currentPage, dataPerPage }: RoleCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const { role: loggedInUserRole } = useSelector(
    (state: RootState) => state.authenticated
  );

  const [openModal, setOpenModal] = useToggle();

  const [deleteRole, { isLoading: isDeleteRoleLoading }] =
    useDeleteRoleMutation();

  //delete job here
  const handleDeleteRole = async () => {
    try {
      await deleteRole(role._id);
      toast.success("Role deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("ROLE_DELETION_ERROR", error);
    }
  };

  return (
    <>
      <tr
        key={role._id}
        className={`border text-center w-full
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2 w-full">
          <p className="truncate">{role.role}</p>
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
              href={`/${loggedInUserRole}/update/role/${role._id}`}
              className=" hover:bg-[#3573A3] hover:text-white text-[#3573A3] font-bold py-2 px-4 rounded border-2 border-[#3573A3]"
            >
              Update
            </Link>
          </div>
        </td>
      </tr>

      {/* Role delete modal */}
      <PopupModal
        type="delete"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={role.role}
        handleFunction={handleDeleteRole}
        isLoading={isDeleteRoleLoading}
      />
    </>
  );
};

export default RoleCard;
