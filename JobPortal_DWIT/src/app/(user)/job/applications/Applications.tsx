"use client";
import React from "react";

import { useGetAllJobApplicationsByApplicantQuery } from "@/lib/store/features/jobApplicationApi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { JobApplication } from "@/lib/types";
import LayoutLoader from "@/components/ui/LayoutLoader";
import { useRouter } from "next/navigation";
import ApplicationCard from "@/components/user/cards/ApplicationCard";

const JobApplicationPage = () => {
  const router = useRouter();
  const { loggedInUserId, loggedInUserToken } = useSelector(
    (state: RootState) => state.authenticated
  );

  if (!loggedInUserToken) {
    router.push("/");
  }

  const { data: allJobApplications, isLoading: isJobApplicationsLoading } =
    useGetAllJobApplicationsByApplicantQuery(loggedInUserId, {
      skip: !loggedInUserToken,
    });
  return (
    <section className="bg-gray-100 min-h-screen pt-10">
      {isJobApplicationsLoading && (
        <div className="h-screen flex items-center justify-center">
          <LayoutLoader />
        </div>
      )}

      <div className="px-4 layout-container">
        <div className="bg-white  flex justify-between rounded-tl-lg rounded-tr-lg py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
          <h2 className="font-semibold sm:text-3xl text-2xl primary-text">
            Applications
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 text-left">
                <th className="px-4">S.N.</th>
                <th className="px-4">Company</th>
                <th className="px-4">Title</th>
                <th className="px-4">Role</th>
                <th className="px-4">Applied Date</th>
              </tr>
            </thead>
            <tbody className="bg-white px-4 capitalize">
              {!isJobApplicationsLoading &&
                allJobApplications?.map(
                  (application: JobApplication, index: number) => (
                    <ApplicationCard
                      key={index}
                      application={application}
                      sn={index}
                    />
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>
      {!allJobApplications?.length && (
        <div className="h-[70vh] text-center content-center block text-gray-400 font-semibold text-3xl">
          No Applied Jobs
        </div>
      )}
    </section>
  );
};

export default JobApplicationPage;
