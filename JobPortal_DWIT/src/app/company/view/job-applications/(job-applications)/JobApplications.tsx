"use client";

import ApplicationCard from "@/components/company/cards/ApplicationCard";
import NoDataFound from "@/components/ui/NoDataFound";
import { useGetAllJobApplicationsByCompanyAndAdminQuery } from "@/lib/store/features/jobApplicationApi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { JobApplication } from "@/lib/types";
import ApplicationStatusButton from "@/components/company/ui/ApplicationStatusButton";
import LayoutLoader from "@/components/ui/LayoutLoader";
import Pagination from "@/components/ui/Pagination";
import { useGetAllJobApplicationsByCompanyAndAdmin } from "@/hooks/useGetAlljobApplicationsByCompanyAndAdmin";

const CompanyJobApplications = () => {
  const { loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );
  const {
    data: allPendingJobApplications,
    isLoading: isJobApplicationsLoading,
  } = useGetAllJobApplicationsByCompanyAndAdminQuery({
    loggedInUserId,
    status: "pending",
  });

  const {
    currentData: currentJobApplications,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = useGetAllJobApplicationsByCompanyAndAdmin({
    data: allPendingJobApplications,
    dataPerPage: 15,
    placeholder: "Search by: Job title, Role, Experience (2, 3, ...)",
  });

  return (
    <>
      <div className="px-4">
        {searchInput}

        <div>
          <div className="bg-white flex flex-wrap gap-4 items-center justify-between py-6 px-4 border-b-2 border-[#0F5288] rounded-tl-lg rounded-tr-lg">
            <h2 className="font-semibold text-3xl primary-text">
              Job Applications
            </h2>
            <ApplicationStatusButton />
          </div>

          {/* loader */}
          {isJobApplicationsLoading && (
            <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
              <LayoutLoader />
            </div>
          )}

          <div>
            {!isJobApplicationsLoading && currentJobApplications?.length
              ? [...currentJobApplications]
                  .sort((a: any, b: any) =>
                    a.jobId.title.localeCompare(b.jobId.title)
                  )
                  .map((application: JobApplication) => (
                    <ApplicationCard
                      key={application._id}
                      application={application}
                    />
                  ))
              : search && <NoDataFound />}

            {!isJobApplicationsLoading &&
              !allPendingJobApplications?.length && <NoDataFound />}
          </div>
        </div>
      </div>

      {/* pagination component */}
      {!isJobApplicationsLoading && displayedData?.length > 15 && (
        <Pagination
          dataPerPage={dataPerPage}
          totalData={displayedData?.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default CompanyJobApplications;
