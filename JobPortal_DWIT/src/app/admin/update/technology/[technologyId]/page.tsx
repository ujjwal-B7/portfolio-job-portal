import TechnologyForm from "@/components/adminAndCompany/forms/TechnologyForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update technology",
};

const TechnologyUpdatePage = ({
  params,
}: {
  params: { technologyId: string };
}) => {
  const { technologyId } = params;

  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
          Update Technology{" "}
        </h1>
        <div className=" pt-6 ">
          <TechnologyForm type="updateTechnology" technologyId={technologyId} />
        </div>
      </div>
    </>
  );
};

export default TechnologyUpdatePage;
