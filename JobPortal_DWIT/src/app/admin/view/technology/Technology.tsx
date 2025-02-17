"use client";
import Link from "next/link";
import { Technology } from "@/lib/types";

import { useGetAllTechnologiesQuery } from "@/lib/store/features/technologyApi";

import Pagination from "@/components/ui/Pagination";
import TechnologyCard from "@/components/adminAndCompany/cards/TechnologyCard";
import { CirclePlus } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

export default function TechnologyPage() {
  const {
    data: allTechnologies,
    isLoading: isTechnologyLoading,
    isError,
  } = useGetAllTechnologiesQuery({});

  const {
    currentData: currentTechnologies,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<Technology>({
    data: allTechnologies,
    dataPerPage: 15,
    searchKeys: ["technology"],
    placeholder: "Search by: Technology",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex justify-between rounded-tl-lg rounded-tr-lg py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold text-3xl primary-text">Technologies</h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg flex items-center gap-2"
          href="/admin/add/technology"
        >
          <CirclePlus className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>

      {/* loader */}
      {isTechnologyLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {/* rendering all data here */}
      {!isTechnologyLoading && currentTechnologies?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 ">
                <th className="px-2 ">S.N.</th>
                <th className="px-2  w-[70%]">Technology</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentTechnologies &&
                currentTechnologies.map(
                  (technology: Technology, index: number) => (
                    <TechnologyCard
                      key={technology._id}
                      technology={technology}
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
        // no data found if there are no search results
        search && <NoDataFound />
      )}

      {/* no data found if there are no any title */}
      {!isTechnologyLoading && !allTechnologies?.length && <NoDataFound />}

      {/* pagination component */}
      {!isTechnologyLoading && displayedData?.length > 15 && (
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
