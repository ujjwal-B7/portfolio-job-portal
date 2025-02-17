"use client";

import Link from "next/link";

import { Job } from "@/lib/types";

import { useGetAllJobsByAdminAndCompanyQuery } from "@/lib/store/features/jobsApi";

import JobCard from "@/components/adminAndCompany/cards/JobCard";
import Pagination from "@/components/ui/Pagination";

import { CirclePlus, Weight } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";

import { useJobsPaginationAndSearch } from "@/hooks/useJobsPaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useEffect, useState } from "react";

import BulkUpload from "@/components/modal/BulkUpload";
import useToggle from "@/hooks/useToggle";

export default function CompanyDashboard() {
  const { role } = useSelector((state: RootState) => state.authenticated);
  const [bulkUploadPopup, setBulkUploadPopup] = useToggle();

  const [activePage, setActivePage] = useState(1);

  const {
    data: allJobs,
    isLoading,
    isError,
  } = useGetAllJobsByAdminAndCompanyQuery(activePage);

  const {
    currentPage,
    setCurrentPage,
    search,
    displayedData,
    searchInput,
    isSearchByUserLoading,
    isSearchByAdminAndCompanyLoading,
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
      <div className=" bg-white flex rounded-tl-lg rounded-tr-lg justify-between py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold text-3xl primary-text">Jobs</h2>
        <div className="flex items-center md:gap-4 gap-3">
          <Link
            className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg flex items-center gap-2"
            href="/company/add/job"
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

      {(!isLoading ||
        !isSearchByUserLoading ||
        !isSearchByAdminAndCompanyLoading) &&
      !!displayedData?.length ? (
        <table className="overflow-x-auto block border-collapse">
          <thead className=" bg-[#E8EEF3] border">
            <tr className="w-full h-16 text-left">
              <th className="px-4">S.N.</th>
              <th className="px-4">Title</th>
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
        search && <NoDataFound />
      )}

      {!isLoading && !allJobs?.jobs?.length && <NoDataFound />}

      {/* pagination component */}
      {!isLoading && (
        <Pagination
          dataPerPage={15}
          totalData={allJobs?.jobsCount || 0}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* bulk upload popup */}
      {bulkUploadPopup && (
        <BulkUpload setBulkUploadPopup={setBulkUploadPopup} />
      )}
    </>
  );
}
