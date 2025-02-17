"use client";

import Link from "next/link";

import { Job } from "@/lib/types";

import { useGetAllJobsByAdminAndCompanyQuery } from "@/lib/store/features/jobsApi";

import JobCard from "@/components/adminAndCompany/cards/JobCard";

import { CirclePlus, Weight } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import LayoutLoader from "@/components/ui/LayoutLoader";
import { useJobsPaginationAndSearch } from "@/hooks/useJobsPaginationAndSearch";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import BulkUpload from "@/components/modal/BulkUpload";
import useToggle from "@/hooks/useToggle";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState(1);
  const [bulkUploadPopup, setBulkUploadPopup] = useToggle();
  const {
    data: allJobs,
    isLoading,
    isSuccess,
  } = useGetAllJobsByAdminAndCompanyQuery(activePage);

  const {
    currentPage,
    setCurrentPage,
    search,
    displayedData,
    searchInput,
    isSearchByUserLoading,
    isSearchByAdminAndCompanyLoading,
    searchResultForAdminAndCompany,
  } = useJobsPaginationAndSearch({
    data: allJobs?.jobs,
    placeholder: "Search by : Title, Company, Domain, Role, Technology",
  });

  useEffect(() => {
    setActivePage(currentPage);
  }, [allJobs, currentPage]);

  return (
    <>
      {searchInput}
      <div className="bg-white flex flex-wrap sm:gap-0 gap-3 justify-between py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem] rounded-tl-lg rounded-tr-lg">
        <h2 className="font-semibold text-3xl primary-text">Jobs</h2>
        <div className="flex items-center md:gap-4 gap-3">
          <Link
            className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg flex items-center gap-2"
            href="/admin/add/job"
          >
            <CirclePlus className="w-5 h-5" /> <span>Add</span>
          </Link>
          <button
            className="bg-custom-blue hover:bg-custom-blue/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={setBulkUploadPopup}
          >
            <Weight className="w-5 h-5" /> <span>Bulk Upload</span>
          </button>
        </div>
      </div>

      {/* loader */}
      {(isLoading ||
        isSearchByUserLoading ||
        isSearchByAdminAndCompanyLoading) && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {/* rendering data here */}
      {(!isLoading ||
        !isSearchByUserLoading ||
        !isSearchByAdminAndCompanyLoading) &&
      !!displayedData?.length ? (
        <table className="overflow-x-auto block border-collapse">
          <thead className=" bg-[#E8EEF3] border">
            <tr className="w-full h-16 text-left">
              <th className="px-4">S.N.</th>
              <th className="px-4">Title</th>
              <th className="px-4">Company</th>
              <th className="px-4">Domain</th>
              <th className="px-4">Technology</th>
              <th className="px-4">Role</th>
              <th className="px-4">Salary</th>
              <th className="px-4 text-nowrap">Application Start</th>
              <th className="px-4 text-nowrap">Application Deadline</th>
              <th className="px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {displayedData?.map((job: Job, index: number) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                currentPage={currentPage}
                dataPerPage={15}
              />
            ))}
          </tbody>
        </table>
      ) : (
        // if no search result then showing no data found
        search && <NoDataFound />
      )}

      {/* if there are no data to render then showing this no data found */}
      {!isLoading && !allJobs?.jobs?.length && <NoDataFound />}

      {!isLoading && (
        <>
          {/* <div>Search count: {searchResultForAdminAndCompany?.length}</div> */}
          <Pagination
            dataPerPage={15}
            totalData={
              searchResultForAdminAndCompany?.length || allJobs?.jobsCount
            }
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* bulk upload popup */}
      {bulkUploadPopup && (
        <BulkUpload setBulkUploadPopup={setBulkUploadPopup} role="admin" />
      )}
    </>
  );
}
