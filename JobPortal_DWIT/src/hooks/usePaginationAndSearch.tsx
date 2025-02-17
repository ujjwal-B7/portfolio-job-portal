import { useMemo, useState, useEffect, ReactNode } from "react";
import useDebounce from "./useDebounce";

interface UsePaginationAndSearchProps<T> {
  data: T[];
  dataPerPage: number;
  searchKeys: (keyof T)[];
  placeholder: string;
}

export function usePaginationAndSearch<T>({
  data,
  dataPerPage,
  searchKeys,
  placeholder,
}: UsePaginationAndSearchProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [displayedData, setDisplayedData] = useState<T[]>([]);

  // adding debounce from debounce hook for delaying the search rendering in every key press
  const debouncedSearch = useDebounce(search, 300);

  // search functionalities
  // let searchResult;
  // searchResult = useMemo(() => {
  //   if (!debouncedSearch) {
  //     return data;
  //   }
  useEffect(() => {
    if (debouncedSearch) {
      const whiteSpaceRemoveRegex = /[\s/,-]+/g;
      const trimmedSearchQuery = debouncedSearch
        ?.replace(whiteSpaceRemoveRegex, "")
        .toLowerCase();
      const filteredSearchResult =
        data?.filter((item: T) =>
          searchKeys.some((key) =>
            (item[key] as string)
              ?.replace(whiteSpaceRemoveRegex, "")
              .toLowerCase()
              .includes(trimmedSearchQuery)
          )
        ) || [];
      setDisplayedData(filteredSearchResult);
    } else {
      // rendering data as it is in the search result array , if there is no search query
      setDisplayedData(data);
    }
  }, [data, debouncedSearch, searchKeys]);

  // pagination
  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    return displayedData?.slice(indexOfFirstItem, indexOfLastItem);
    // return searchResult?.length
    //   ? searchResult.slice(indexOfFirstItem, indexOfLastItem)
    //   : data?.slice(indexOfFirstItem, indexOfLastItem);
  }, [displayedData, currentPage, dataPerPage]);

  const searchInput: ReactNode = useMemo(
    () => (
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
