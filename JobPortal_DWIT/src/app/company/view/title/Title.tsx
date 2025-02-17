"use client";
import Link from "next/link";
import { Title } from "@/lib/types";
import { useGetAllTitlesQuery } from "@/lib/store/features/titleApi";
import TitleCard from "@/components/adminAndCompany/cards/TitleCard";
import Pagination from "@/components/ui/Pagination";
import { CirclePlus } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

export default function TitlePage() {
  const {
    data: allTitles,
    isLoading: isTitleLoading,
    isError,
  } = useGetAllTitlesQuery({});

  const {
    currentData: currentTitles,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<Title>({
    data: allTitles,
    dataPerPage: 15,
    searchKeys: ["title"],
    placeholder: "Search by: Title",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex rounded-tl-lg rounded-tr-lg justify-between py-6 px-4 border-b-2 border-[#0F5288]">
        <h2 className="font-semibold text-3xl primary-text">Titles</h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg flex items-center gap-2"
          href="/company/add/title"
        >
          <CirclePlus className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>

      {/* loader */}
      {isTitleLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {/* rendering all data here */}
      {!isTitleLoading && !!currentTitles?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16">
                <th className="px-2">S.N.</th>
                <th className="px-2">Title</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentTitles &&
                currentTitles.map((title: Title, index: number) => (
                  <TitleCard
                    key={title._id}
                    title={title}
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

      {/* no data found if there are no any title */}
      {!isTitleLoading && !allTitles?.length && <NoDataFound />}

      {/* pagination component */}
      {!isTitleLoading && displayedData?.length > 15 && (
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
