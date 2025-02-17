"use client";

import { Job } from "@/lib/types";
import React, { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

interface JobSearchProps {
  search: string;
  setSearch: (value: string) => void;
  allJobs?: Job[];
  setSearchResult: (value: Job[]) => void;
}

const JobSearch = ({
  search,
  setSearch,
  allJobs,
  setSearchResult,
}: JobSearchProps) => {
  const debouncedSearch = useDebounce(search, 300);

  // searching for a job
  useEffect(() => {
    const whiteSpaceRemoveRegex = /[\s/,-]+/g;
    const trimmedSearchQuery = debouncedSearch
      .replace(whiteSpaceRemoveRegex, "")
      .toLowerCase();
    const filteredResults =
      allJobs &&
      allJobs.filter(
        (job: Job) =>
          job.technology
            .replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          job.type.trim().toLowerCase().includes(search.trim().toLowerCase()) ||
          job.company
            .replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          job.title
            .replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          job.role
            .replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery) ||
          job.domain
            .replace(whiteSpaceRemoveRegex, "")
            .toLowerCase()
            .includes(trimmedSearchQuery)
      );
    if (filteredResults && filteredResults.length > 0) {
      setSearchResult(filteredResults);
    } else {
      setSearchResult([]);
    }
  }, [allJobs, search, debouncedSearch, setSearchResult]);

  return (
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
      placeholder="Search by : Title, Company, Domain, Role, Technology"
    />
  );
};

export default JobSearch;
