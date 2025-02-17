"use client";
import Link from "next/link";
import { Salary } from "@/lib/types";

import { useGetAllSalariesQuery } from "@/lib/store/features/salaryApi";

import Pagination from "@/components/ui/Pagination";
import SalaryCard from "@/components/adminAndCompany/cards/SalaryCard";
import { CirclePlus } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

export default function SalaryPage() {
  const {
    data: allSalarys,
    isLoading: isSalaryLoading,
    isError,
  } = useGetAllSalariesQuery({});

  const {
    currentData: currentSalarys,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<Salary>({
    data: allSalarys,
    dataPerPage: 15,
    searchKeys: ["salary"],
    placeholder: "Search by: Salary",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex justify-between rounded-tl-lg rounded-tr-lg py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold sm:text-3xl text-2xl primary-text">
          Salaries
        </h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg sm:text-base text-sm flex items-center gap-2"
          href="/admin/add/salary"
        >
          <CirclePlus className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>

      {/* loader */}
      {isSalaryLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {/* rendering all data here */}
      {!isSalaryLoading && currentSalarys?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 ">
                <th className="px-2 ">S.N.</th>
                <th className="px-2  w-[70%]">Salary</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentSalarys &&
                currentSalarys.map((salary: Salary, index: number) => (
                  <SalaryCard
                    key={salary._id}
                    salary={salary}
                    index={index}
                    currentPage={currentPage}
                    dataPerPage={dataPerPage}
                  />
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        // no data found if there are no search results
        search && <NoDataFound />
      )}

      {/* no data found if there are no any salarys */}
      {!isSalaryLoading && !allSalarys?.length && <NoDataFound />}

      {/* pagination component */}
      {!isSalaryLoading && displayedData?.length > 15 && (
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
