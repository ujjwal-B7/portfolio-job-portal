import JobDetails from "./JobDetails";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const fetchJobDetails = async (jobId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${jobId}`,{
      cache:"no-cache"
    }
  );
  const job = await res.json();
  return job;
};

// generating dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { jobId: string };
}) {
  const job = await fetchJobDetails(params.jobId);
  return {
    title: job.title,
    description: job.description,
  };
}

const page = async ({ params }: { params: { jobId: string } }) => {
  const job = await fetchJobDetails(params.jobId);
  return (
    <Suspense
      fallback={
        <Loader2 className="text-custom-blue w-10 h-10 animate-spin fixed top-1/2 left-1/2" />
      }
    >
      <JobDetails params={params} job={job} />
    </Suspense>
  );
};

export default page;
