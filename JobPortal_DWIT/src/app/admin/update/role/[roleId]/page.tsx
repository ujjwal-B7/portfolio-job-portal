import RoleForm from "@/components/adminAndCompany/forms/RoleForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update role",
};

const RoleUpdatePage = ({ params }: { params: { roleId: string } }) => {
  const { roleId } = params;

  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
          Update Role{" "}
        </h1>
        <div className=" pt-6 ">
          <RoleForm type="updateRole" roleId={roleId} />
        </div>
      </div>
    </>
  );
};

export default RoleUpdatePage;
