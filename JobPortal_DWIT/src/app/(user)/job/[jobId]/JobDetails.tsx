"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { useGetSingleJobDetailsQuery } from "@/lib/store/features/jobsApi";

import parse from "react-html-parser";
import ApplyToJobModal from "@/components/modal/ApplyToJobModal";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetAllJobApplicationsByApplicantQuery } from "@/lib/store/features/jobApplicationApi";

import { Loader2 } from "lucide-react";
import useToggle from "@/hooks/useToggle";
import { Job } from "@/lib/types";

interface JobDetailsProps {
  params: { jobId: string };
  job: Job;
}

const JobDetails = ({ params, job }: JobDetailsProps) => {
  const { jobId } = params;
  const router = useRouter();

  const { loggedInUserId, loggedInUserToken } = useSelector(
    (state: RootState) => state.authenticated
  );
  const {
    data: allJobApplications,
    isLoading: isJobApplicationsLoading,
    refetch,
  } = useGetAllJobApplicationsByApplicantQuery(loggedInUserId);

  const [showApplyToJobPopup, setShowApplyToJobPopup] = useToggle();
  const [showFullDescription, setShowFullDescription] = useToggle();

  // const { data: job, isLoading } = useGetSingleJobDetailsQuery(jobId);
  const [companyLogo, setCompanyLogo] = useState("");

  function formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US");
  }

  const handleApplyToJob = () => {
    if (!loggedInUserToken) {
      router.push("/employee/login");
      toast.warn("Please login to apply.");
      return;
    }
    setShowApplyToJobPopup();
  };

  const isApplied: boolean = useMemo(() => {
    return allJobApplications?.some(
      (appliedJob: any) => appliedJob.jobId === jobId
    );
  }, [allJobApplications, jobId]);

  useEffect(() => {
    if (job) {
      setCompanyLogo(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${
          job.companyId ? job.companyId.logo : job.profileId.logo
        }`
      );
    }
    // else {
    //   setCompanyLogo("/images/office-building.png");
    // }
  }, [job]);

  const companyDescription =
    job?.companyId?.description || job?.profileId?.description;

  return (
    <main>
      {/* {false && (
        <Loader2 className="text-custom-blue w-10 h-10 animate-spin fixed top-1/2 left-1/2" />
      )} */}
      {job && (
        <>
          <div className="sm:px-5 px-4">
            <div className="max-w-[1150px] shadow_div mx-auto mt-16 rounded-md sm:px-5 py-3">
              <div className="flex sm:flex-row flex-col justify-between items-center sm:gap-0 gap-2">
                <Link href="/">
                  <Image
                    src="/images/go-back.png"
                    width={24}
                    height={24}
                    alt="Go Back"
                    className="sm:ml-[28px] sm:block hidden"
                  />
                </Link>
                <h1 className="primary-text font-semibold  md:text-2xl text-xl">
                  {job?.title}
                </h1>
                <div className="sm:block hidden"></div>
              </div>
              <div className="ml-[28px]">
                <h2 className="secondary-text font-bold sm:text-xl text-lg md:mt-10 mt-8 mb-4 text-gray-900">
                  Company Overview
                </h2>
                <div className="sm:flex gap-5">
                  <div className="w-24 h-24 rounded-full flex-shrink-0 mt-1">
                    {" "}
                    <Image
                      src={companyLogo}
                      alt="Deerwalk Jobs"
                      width={84}
                      height={84}
                      priority
                      className="w-full h-full rounded-full object-cover md:mx-0 "
                      onError={() =>
                        setCompanyLogo("/images/office-building.png")
                      }
                      // onError={() => {
                      //   if (companyLogo !== "/images/office-building.png") {
                      //     setCompanyLogo("/images/office-building.png");
                      //   }
                      // }}
                    />
                  </div>
                  <p className="text-[0.95rem] sm:mt-0 mt-3">
                    {showFullDescription ? (
                      companyDescription
                    ) : (
                      <>
                        {companyDescription?.length > 500
                          ? companyDescription.slice(0, 688) + " ..."
                          : companyDescription}
                      </>
                    )}
                  </p>
                </div>
                <div className="text-end pb-4 -mt-1 sm:mr-0 mr-3">
                  {companyDescription?.length > 500 && (
                    <button
                      className="text-custom-blue font-light hover:underline font-arial-rounded"
                      onClick={setShowFullDescription}
                    >
                      {showFullDescription ? "view less" : "view more"}
                    </button>
                  )}
                </div>
                <div className="flex flex-col lg:gap-5">
                  <div>
                    <h3 className="text-gray-900 font-bold text-xl mt-4 mb-3">
                      Requirements
                    </h3>
                    <p className="bullet-list">{parse(job?.description)}</p>
                  </div>

                  <div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-xl mt-2 mb-1.5">
                        Qualification
                      </h3>
                      <p className="p-2 bullet-list">
                        {parse(job?.qualification)}
                      </p>
                    </div>
                    <div className="mt-4 flex md:gap-16 gap-9 text-base list-none">
                      <div className="sm:space-y-4 space-y-3 font-semibold sm:text-[1.125rem] text-gray-900">
                        <li>Salary</li>
                        <li>Technology</li>
                        <li>Job Type</li>
                        <li>Job Role</li>
                        <li>Application Deadline</li>
                        {job?.location && <li>Location</li>}
                      </div>
                      <div className="capitalize sm:space-y-4 space-y-3 light-text">
                        <li>{job?.salary}</li>
                        <li>{job?.technology}</li>
                        <li>{job?.type}</li>
                        <li>{job?.role}</li>
                        <li>{formatDate(job?.applicationDeadline)}</li>

                        {/* for now conditionally rendering job location, as new field is added in database, so after updating all the previous data with location , it will be rendered on all jobs */}
                        {job?.location && <li>{job?.location}</li>}
                      </div>
                    </div>
                  </div>
                </div>
                {isApplied ? (
                  <button
                    disabled={true}
                    className="mt-7 bg-[#0F5288]/40 items-center justify-center flex rounded-md md:w-fit px-5 py-3  cursor-not-allowed
                "
                  >
                    <Image
                      src="/images/apply-btn.png"
                      width={13}
                      height={13.35}
                      alt="apply here"
                    />
                    <span className="text-white ml-[0.625rem] font-arial-rounded-regular">
                      Applied
                    </span>
                  </button>
                ) : (
                  <button
                    className="sm:mt-9 mt-7 bg-[#0F5288] items-center justify-center flex rounded-md md:w-fit px-5 py-3 transition-transform duration-300 hover:bg-hover-blue
                "
                    onClick={handleApplyToJob}
                    // href={job?.link}
                    // target="_blank"
                    // rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/apply-btn.png"
                      width={13}
                      height={13.35}
                      alt="apply here"
                    />
                    <span className="text-white ml-[0.625rem] font-arial-rounded-regular">
                      Apply Here
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {showApplyToJobPopup && (
        <ApplyToJobModal
          refetch={refetch}
          job={job}
          setShowApplyToJobPopup={setShowApplyToJobPopup}
        />
      )}
    </main>
  );
};
// function renderSalary(salary) {
//   if (typeof salary === 'number') {
//     return `Rs. ${salary}`;
//   } else if (typeof salary === 'string' && salary.includes('-')) {
//     const [start, end] = salary.split('-');
//     return `Rs. ${start}-${end}`;
//   } else {
//     return salary;
//   }
// }
export default JobDetails;
