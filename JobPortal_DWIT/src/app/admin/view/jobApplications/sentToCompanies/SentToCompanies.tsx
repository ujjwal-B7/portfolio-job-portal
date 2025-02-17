"use client";

import NoDataFound from "@/components/ui/NoDataFound";

import { JobApplication } from "@/lib/types";
import AcceptedApplicationCard from "@/components/company/cards/AcceptedApplicationCard";
import LayoutLoader from "@/components/ui/LayoutLoader";
import { Clock } from "lucide-react";
import Link from "next/link";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import { useGetAllJobApplicationsByCompanyAndAdminQuery } from "@/lib/store/features/jobApplicationApi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Pagination from "@/components/ui/Pagination";
import { useGetAllJobApplicationsByCompanyAndAdmin } from "@/hooks/useGetAlljobApplicationsByCompanyAndAdmin";

const AcceptedJobApplications = () => {
  // Use custom hook
  const { loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );
  const {
    data: allJobApplicationsByCompanyAndAdmin,
    isLoading: isJobApplicationsLoading,
  } = useGetAllJobApplicationsByCompanyAndAdminQuery({
    loggedInUserId,
    status: "dispatched",
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
    data: allJobApplicationsByCompanyAndAdmin,
    dataPerPage: 15,
    placeholder: "Search by: Job title, Role, Experience (2, 3, ...)",
  });

  return (
    <>
      <div className="px-4">
        {searchInput}
        <div>
          <div className="bg-white py-6 px-4 flex flex-wrap gap-4 items-center justify-between border-b-2 border-[#0F5288] rounded-tl-lg rounded-tr-lg">
            <h2 className="font-semibold text-3xl primary-text">
              Sent Applications
            </h2>
            <Link
              className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md flex items-center gap-2"
              href="/admin/view/jobApplications"
            >
              <Clock className="w-5 h-5" />
              Pending
            </Link>
          </div>
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
                    <AcceptedApplicationCard
                      key={application._id}
                      application={application}
                    />
                  ))
              : search && <NoDataFound />}
          </div>
          {!isJobApplicationsLoading &&
            !allJobApplicationsByCompanyAndAdmin?.length && <NoDataFound />}
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

export default AcceptedJobApplications;
