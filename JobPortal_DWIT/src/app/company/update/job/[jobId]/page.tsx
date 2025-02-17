//job schema using zod
// const jobSchema = z.object({
//   title: z.string().min(1, { message: "Required." }),
//   technology: z.string().min(1, { message: "Required." }),
//   salary: z.string().min(1, { message: "Required." }),
//   company: z.string().min(1, { message: "Required." }),
//   role: z.string().min(1, { message: "Required." }),
//   domain: z.string().min(1, { message: "Required." }),
//   type: z.string().min(1, { message: "Required." }),
//   link: z.string().min(1, { message: "Required." }),
//   companydescription: z.string().min(1, { message: "Required." }),
//   logo: z.string().min(1, { message: "Required." }),
//   description: z.string().min(1, { message: "Required." }),
//   qualification: z.string().min(1, { message: "Required." }),
//   applicationStart: z.string().min(1, { message: "Required." }),
//   applicationDeadline: z.string().min(1, { message: "Required." }),
// });

import CompanyJobForm from "@/components/company/forms/CompanyJobForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update job",
};

const JobUpdatePage = ({ params }: { params: { jobId: string } }) => {
  const { jobId } = params;

  return (
    <>
      <div className="bg-white py-6 mt-10 rounded-md">
        <h1 className="text-3xl font-semibold primary-text py-4 w-full border-[#0F5288] border-b-2 px-4">
          Update Job{" "}
        </h1>
        <div className="flex lg:flex-row flex-col-reverse gap-5 pt-6 ">
          <CompanyJobForm type="updateJob" jobId={jobId} />
        </div>
      </div>
    </>
  );
};

export default JobUpdatePage;
