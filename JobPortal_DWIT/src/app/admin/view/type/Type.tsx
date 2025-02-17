"use client";

import Link from "next/link";
import { Type } from "@/lib/types";

import { useGetAllTypesQuery } from "@/lib/store/features/typeApi";

import Pagination from "@/components/ui/Pagination";
import TypeCard from "@/components/adminAndCompany/cards/TypeCard";
import { CirclePlus } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

export default function TypePage() {
  const {
    data: allTypes,
    isLoading: isTypeLoading,
    isError,
  } = useGetAllTypesQuery({});

  const {
    currentData: currentTypes,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<Type>({
    data: allTypes,
    dataPerPage: 15,
    searchKeys: ["types"],
    placeholder: "Search by: Type",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex justify-between rounded-tl-lg rounded-tr-lg py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold sm:text-3xl text-2xl primary-text">
          Types
        </h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg sm:text-base text-sm flex items-center gap-2"
          href="/admin/add/type"
        >
          <CirclePlus className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>

      {/* loader */}
      {isTypeLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {/* rendering types here */}
      {!isTypeLoading && currentTypes?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 ">
                <th className="px-2 ">S.N.</th>
                <th className="px-2  w-[70%]">Type</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentTypes &&
                currentTypes.map((types: Type, index: number) => (
                  <TypeCard
                    key={types._id}
                    types={types}
                    index={index}
                    currentPage={currentPage}
                    dataPerPage={dataPerPage}
                  />
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        // no data found if no search results
        search && <NoDataFound />
      )}

      {/* no data found if there are no any types */}
      {!isTypeLoading && !allTypes?.length && <NoDataFound />}

      {/* pagination component */}
      {!isTypeLoading && displayedData?.length > 15 && (
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
