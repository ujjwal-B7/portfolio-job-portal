import RoleForm from "@/components/adminAndCompany/forms/RoleForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add role",
};

const RoleAddPage = () => {
  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md ">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
          Add Role{" "}
        </h1>
        <div className="pt-6">
          <RoleForm type="createRole" />
        </div>
      </div>
    </>
  );
};

export default RoleAddPage;
