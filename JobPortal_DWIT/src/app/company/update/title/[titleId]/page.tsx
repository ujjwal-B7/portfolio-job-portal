import TitleForm from "@/components/adminAndCompany/forms/TitleForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update title",
};

const TitleUpdatePage = ({ params }: { params: { titleId: string } }) => {
  const { titleId } = params;

  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
          Update Title{" "}
        </h1>
        <div className=" pt-6 ">
          <TitleForm type="updateTitle" titleId={titleId} />
        </div>
      </div>
    </>
  );
};

export default TitleUpdatePage;
