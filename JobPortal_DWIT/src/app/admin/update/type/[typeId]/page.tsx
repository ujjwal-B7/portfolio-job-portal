import TypeForm from "@/components/adminAndCompany/forms/TypeForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update type",
};

const TypeUpdatePage = ({ params }: { params: { typeId: string } }) => {
  const { typeId } = params;

  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
          Update Type{" "}
        </h1>
        <div className=" pt-6 ">
          <TypeForm type="updateType" typeId={typeId} />
        </div>
      </div>
    </>
  );
};

export default TypeUpdatePage;
