"use client";
import Link from "next/link";
import { Domain } from "@/lib/types";

import { useGetAllDomainsQuery } from "@/lib/store/features/domainApi";

import Pagination from "@/components/ui/Pagination";
import DomainCard from "@/components/adminAndCompany/cards/DomainCard";
import { CirclePlus } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

export default function DomainPage() {
  const {
    data: allDomains,
    isLoading: isDomainLoading,
    isError,
  } = useGetAllDomainsQuery({});

  const {
    currentData: currentDomains,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<Domain>({
    data: allDomains,
    dataPerPage: 15,
    searchKeys: ["domain"],
    placeholder: "Search by: Domain",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex rounded-tl-lg rounded-tr-lg justify-between py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold sm:text-3xl text-2xl primary-text">
          Domains
        </h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg sm:text-base text-sm flex items-center gap-2"
          href="/admin/add/domain"
        >
          <CirclePlus className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>

      {/* loader */}
      {isDomainLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {!isDomainLoading && currentDomains?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 ">
                <th className="px-2 ">S.N.</th>
                <th className="px-2  w-[70%]">Domain</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentDomains &&
                currentDomains.map((domain: Domain, index: number) => (
                  <DomainCard
                    key={domain._id}
                    domain={domain}
                    index={index}
                    currentPage={currentPage}
                    dataPerPage={dataPerPage}
                  />
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        search && <NoDataFound />
      )}

      {!isDomainLoading && !allDomains?.length && <NoDataFound />}

      {/* pagination component */}
      {!isDomainLoading && displayedData?.length > 15 && (
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
