import { useMemo, useState, useEffect, ReactNode } from "react";
import useDebounce from "./useDebounce";
import { Job } from "@/lib/types";
import {
  useSearchJobsByUserQuery,
  useSearchJobsByAdminAndCompanyQuery,
} from "@/lib/store/features/jobsApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface UseJobsPaginationAndSearchProps {
  data: Job[];
  placeholder: string;
}

export function useJobsPaginationAndSearch({
  data,
  placeholder,
}: UseJobsPaginationAndSearchProps) {
  const { role } = useSelector((state: RootState) => state.authenticated);
  const router = useRouter();
  const query = useSearchParams().get("q");
  const page = useSearchParams().get("page");
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [search, setSearch] = useState(query || "");
  const [displayedData, setDisplayedData] = useState<Job[]>([]);
  const [didYouMean, setDidYouMean] = useState([]);

  // adding debounce from debounce hook for delaying the search rendering in every key press
  const debouncedSearch = useDebounce(search, 300);

  // search endpoint for employee only
  const { data: searchResultForUser, isLoading: isSearchByUserLoading } =
    useSearchJobsByUserQuery(debouncedSearch, {
      skip: !debouncedSearch || role === "admin" || role === "company",
    });

  // search endpoint for admin and company only
  const {
    data: searchResultForAdminAndCompany,
    isLoading: isSearchByAdminAndCompanyLoading,
  } = useSearchJobsByAdminAndCompanyQuery(debouncedSearch, {
    skip: !debouncedSearch || !role || role === "employee",
  });

  // condition for displaying the corrected word for search typo error
  useEffect(() => {
    if (
      searchResultForUser?.length &&
      typeof searchResultForUser?.[0] === "string"
    ) {
      setDidYouMean(searchResultForUser);
    }
  }, [searchResultForUser, debouncedSearch]);

  // Update the URL with the search term
  useEffect(() => {
    if (debouncedSearch) {
      // if search keyword and pagination showing this query
      if (currentPage > 1) {
        router.push(`?q=${debouncedSearch}&page=${currentPage}`, {
          scroll: false,
        });
        return;
      }
      // only search keyword showing this query
      router.push(`?q=${debouncedSearch}`, { scroll: false });
      return;
    }

    // without serach query if pagination then showing this
    if (currentPage > 1) {
      router.push(`?page=${currentPage}`, { scroll: false });
      return;
    }
    router.push(window.location.pathname);
  }, [debouncedSearch, currentPage, router]);

  // displaying search result or all jobs based on condition
  useEffect(() => {
    if (debouncedSearch) {
      /*
      checking if value inside search result array is string or not, as we are sending suggested word as string,
      so if we are sending suggested word then rendering all the jobs and only displaying the suggested word and if there is json object inside searchResult array then displaying the search result as it is
      */

      if (
        (searchResultForUser?.length &&
          typeof searchResultForUser?.[0] !== "string") ||
        searchResultForAdminAndCompany
      ) {
        setDisplayedData(searchResultForUser || searchResultForAdminAndCompany);
        return;
      }

      // if no result found in backend then showing all data for employee
      setDisplayedData(data);
      return;
    }
    // rendering data as it is in the search result array , if there is no search query
    if (!debouncedSearch) {
      setDidYouMean([]);
      setDisplayedData(data);
    }
  }, [
    data,
    searchResultForUser,
    searchResultForAdminAndCompany,
    debouncedSearch,
  ]);

  // if someone clicked the logo in navbar then reseting search also
  useEffect(() => {
    if (!query) setSearch("");
  }, [query]);

  const searchInput: ReactNode = useMemo(
    () => (
      <>
        <div className="max-w-[45rem]">
          <input
            type="text"
            id="search"
            name="search"
            className="border-none rounded-lg focus:outline-none placeholder-[#919191] sm:px-16 px-4bg-[#ffffff] w-full lg:h-[3.75rem] shadow_div my-[2rem] h-[3.5rem]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      </>
    ),
    [search, placeholder]
  );

  return {
    search,
    setSearch,
    displayedData,
    currentPage,
    setCurrentPage,
    searchInput,
    isSearchByUserLoading,
    isSearchByAdminAndCompanyLoading,
    searchResultForAdminAndCompany,
    didYouMean,
  };
}
