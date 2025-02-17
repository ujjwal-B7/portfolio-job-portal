"use client";

import NoDataFound from "@/components/ui/NoDataFound";

import { useGetAllRegisteredCompaniesForVerificationQuery } from "@/lib/store/features/registeredCompaniesApi";

import { RegisteredCompanies } from "@/lib/types";
import RegisteredCompaniesCard from "@/components/admin/cards/RegisteredCompaniesCard";

import Pagination from "@/components/ui/Pagination";
import CompaniesTable from "@/components/admin/ui/CompaniesTable";
import CompaniesStatusButton from "@/components/admin/ui/CompaniesStatusButton";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

const RegisteredCompaniesPage = () => {
  const { data: allPendingCompanies, isLoading: isPendingCompaniesLoading } =
    useGetAllRegisteredCompaniesForVerificationQuery("pending");

  const {
    currentData: currentPengingCompanies,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<RegisteredCompanies>({
    data: allPendingCompanies,
    dataPerPage: 15,
    searchKeys: ["name", "email", "company_domain", "address", "pan_number"],
    placeholder: "Search by : Company name, email, domain, pan number",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex flex-wrap gap-4 items-center justify-between py-6 px-4 border-b-2 border-[#0F5288] rounded-tl-lg rounded-tr-lg">
        <h2 className="font-semibold text-3xl primary-text">
          Pending Companies
        </h2>

        <CompaniesStatusButton />
      </div>

      {/* loader */}
      {isPendingCompaniesLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {!isPendingCompaniesLoading && currentPengingCompanies?.length > 0 ? (
        <CompaniesTable
          currentRegisteredCompanies={currentPengingCompanies}
          CardComponent={RegisteredCompaniesCard}
          currentPage={currentPage}
          dataPerPage={dataPerPage}
        />
      ) : (
        search && <NoDataFound />
      )}

      {!isPendingCompaniesLoading && !allPendingCompanies?.length && (
        <NoDataFound />
      )}

      {/* pagination component */}
      {!isPendingCompaniesLoading && displayedData?.length > 15 && (
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

export default RegisteredCompaniesPage;
