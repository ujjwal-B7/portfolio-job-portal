import { RegisteredCompanies } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface RegisteredCompaniesSearchProps {
  search: string;
  setSearch: (value: string) => void;
  allRegisteredCompanies?: RegisteredCompanies[];
  setSearchResult: (value: RegisteredCompanies[]) => void;
}

const RegisteredCompaniesSearch = ({
  allRegisteredCompanies,
  search,
  setSearchResult,
  setSearch,
}: RegisteredCompaniesSearchProps) => {
  //search implementation
  useEffect(() => {
    // if (search) {
    const whiteSpaceRemoveRegex = /[\s/,-]+/g;
    const trimmedSearchQuery = search
      ?.replace(whiteSpaceRemoveRegex, "")
      .toLowerCase();

    const filteredResults =
      allRegisteredCompanies &&
      allRegisteredCompanies.filter(
        (company: RegisteredCompanies) =>
          company?.name
            ?.replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          company?.email
            ?.replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          company?.company_domain
            ?.replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          company?.address
            ?.replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          company?.pan_number
            ?.replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery)
      );
    if (filteredResults && filteredResults.length > 0) {
      setSearchResult(filteredResults);
    } else {
      setSearchResult([]);
      // }
    }
  }, [allRegisteredCompanies, search, setSearchResult]);
  return (
    <div className="max-w-[45rem]">
      <input
        type="text"
        id="search"
        name="search"
        className=" 
        border-none
        rounded-lg
        focus:outline-none 
        placeholder-[#919191] 
        sm:px-16 
        px-4
        bg-[#ffffff] 
        w-full
        lg:h-[3.75rem] 
        shadow_div
        my-[2rem]
        h-[3.5rem]
      "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by : Company name, email, domain, pan number"
      />
    </div>
  );
};

export default RegisteredCompaniesSearch;
