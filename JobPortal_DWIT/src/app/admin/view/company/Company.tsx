"use client";
import Link from "next/link";
import { Company } from "@/lib/types";
import { useGetAllCompaniesQuery } from "@/lib/store/features/companyApi";

import Pagination from "@/components/ui/Pagination";
import CompanyCard from "@/components/adminAndCompany/cards/CompanyCard";
import { CirclePlus } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

export default function CompanyPage() {
  const { data: allCompanies, isLoading: isCompanyLoading } =
    useGetAllCompaniesQuery({});
  const {
    currentData: currentCompanies,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<Company>({
    data: allCompanies,
    dataPerPage: 15,
    searchKeys: ["company"],
    placeholder: "Search by: Company",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex rounded-tl-lg rounded-tr-lg items-center justify-between py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold sm:text-3xl text-2xl primary-text">
          Companies
        </h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg sm:text-base text-sm flex items-center gap-2"
          href="/admin/add/company"
        >
          <CirclePlus className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>

      {/* loader */}
      {isCompanyLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {!isCompanyLoading && currentCompanies?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16">
                <th className="px-2">S.N.</th>
                <th className="px-2">Company</th>
                <th className="px-2 w-[40%]">Company Description</th>
                <th className="px-2">Company Logo</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentCompanies &&
                currentCompanies.map((company: Company, index: number) => (
                  <CompanyCard
                    key={company._id}
                    company={company}
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

      {!isCompanyLoading && !allCompanies?.length && <NoDataFound />}

      {/* pagination component */}
      {!isCompanyLoading && displayedData?.length > 15 && (
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
