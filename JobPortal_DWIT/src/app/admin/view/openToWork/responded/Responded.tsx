"use client";
import Link from "next/link";

import { useGetAllOpenToWorkRequestQuery } from "@/lib/store/features/openToWorkApi";

import Pagination from "@/components/ui/Pagination";
import { Clock } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";
import OpenToWorkCard from "@/components/admin/cards/OpenToWorkCard";

import { OpenToWork } from "@/lib/types";

export default function RespondedOpenToWorkResquets() {
  const {
    data: allOpenToWork,
    isLoading: isOpenToWorkLoading,
    isError,
  } = useGetAllOpenToWorkRequestQuery(true);

  const {
    currentData: currentOpenToWork,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<OpenToWork>({
    data: allOpenToWork,
    dataPerPage: 15,
    searchKeys: [
      "job_title",
      "employee_name",
      "email",
      "contact_number",
      "degree",
    ],
    placeholder:
      "Search by: Job title, employee name, email, contact number, degree",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex flex-wrap rounded-tl-lg rounded-tr-lg justify-between py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold sm:text-3xl text-2xl primary-text">
          Responded
        </h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg sm:text-base text-sm flex items-center gap-2"
          href="/admin/view/openToWork"
        >
          <Clock className="w-5 h-5" /> <span>Pending</span>
        </Link>
      </div>

      {/* loader */}
      {isOpenToWorkLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {!isOpenToWorkLoading && currentOpenToWork?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 text-left">
                <th className="px-6 ">S.N.</th>
                <th className="px-6 truncate">Job Title</th>
                <th className="px-6 truncate">Employee Name</th>
                <th className="px-6 ">Email</th>
                <th className="px-6 truncate">Contact Number</th>
                <th className="px-6 ">Salary</th>
                <th className="px-6 ">Degree</th>
                <th className="px-6 ">Experience</th>
                <th className="px-6 ">Skills</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentOpenToWork?.map(
                (openToWork: OpenToWork, index: number) => (
                  <OpenToWorkCard
                    key={openToWork._id}
                    openToWork={openToWork}
                    index={index}
                    currentPage={currentPage}
                    dataPerPage={dataPerPage}
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        search && <NoDataFound />
      )}

      {!isOpenToWorkLoading && !allOpenToWork?.length && <NoDataFound />}

      {/* pagination component */}
      {!isOpenToWorkLoading && displayedData?.length > 15 && (
        <Pagination
          dataPerPage={dataPerPage}
          totalData={displayedData?.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
