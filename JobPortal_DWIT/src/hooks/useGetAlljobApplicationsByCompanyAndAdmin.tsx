import { useMemo, useState, useEffect, ReactNode } from "react";
import useDebounce from "./useDebounce";
import { JobApplication } from "@/lib/types";

interface UseGetAllJobApplicationsByCompanyAndAdminProps {
  data: JobApplication[];
  dataPerPage: number;
  placeholder: string;
}

export function useGetAllJobApplicationsByCompanyAndAdmin({
  data,
  dataPerPage,
  placeholder,
}: UseGetAllJobApplicationsByCompanyAndAdminProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [displayedData, setDisplayedData] = useState<JobApplication[]>([]);

  // adding debounce from debounce hook for delaying the search rendering in every key press
  const debouncedSearch = useDebounce(search, 300);

  // Search logic
  useEffect(() => {
    if (debouncedSearch) {
      const whiteSpaceRemoveRegex = /[\s/,-]+/g;
      const trimmedSearchQuery = debouncedSearch
        .replace(whiteSpaceRemoveRegex, "")
        .toLowerCase();

      const filteredSearchResult =
        data?.filter(
          (application: JobApplication) =>
            application?.jobId?.title
              ?.replace(whiteSpaceRemoveRegex, "")
              .toLowerCase()
              .includes(trimmedSearchQuery) ||
            (
              application?.jobId?.companyId?.company ||
              application?.jobId?.profileId?.name
            )
              ?.replace(whiteSpaceRemoveRegex, "")
              .toLowerCase()
              .includes(trimmedSearchQuery) ||
            application?.jobId?.role
              ?.replace(whiteSpaceRemoveRegex, "")
              .toLowerCase()
              .includes(trimmedSearchQuery) ||
            application?.experience
              ?.replace(whiteSpaceRemoveRegex, "")
              .toLowerCase()
              .includes(trimmedSearchQuery)
        ) || [];
      setDisplayedData(filteredSearchResult);
    } else {
      setDisplayedData(data);
    }
  }, [data, debouncedSearch]);

  // pagination
  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    return displayedData?.slice(indexOfFirstItem, indexOfLastItem);
  }, [displayedData, currentPage, dataPerPage]);

  const searchInput: ReactNode = useMemo(
    () => (
      <div className="max-w-[45rem]">
        <input
          type="text"
          id="search"
          name="search"
          className="border-none rounded-lg focus:outline-none placeholder-[#919191] sm:px-16 px-4 bg-[#ffffff] w-full lg:h-[3.75rem] shadow_div my-[2rem] h-[3.5rem]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    ),
    [search, placeholder]
  );

  return {
    search,
    currentData,
    displayedData,
    dataPerPage,
    currentPage,
    setCurrentPage,
    searchInput,
  };
}
