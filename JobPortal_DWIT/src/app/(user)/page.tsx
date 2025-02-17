"use client";

import UserJobCard from "@/components/user/cards/UserJobCard";
import LayoutLoader from "@/components/ui/LayoutLoader";
import { useGetAllJobsByUserQuery } from "@/lib/store/features/jobsApi";
import { Job } from "@/lib/types";

import Image from "next/image";
import OpenToWork from "@/components/user/forms/OpenToWork";

import { useJobsPaginationAndSearch } from "@/hooks/useJobsPaginationAndSearch";
import Pagination from "@/components/ui/Pagination";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Home() {
  const [activePage, setActivePage] = useState(1);
  const { data: allJobs, isLoading, isSuccess } = useGetAllJobsByUserQuery({});

  const {
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    displayedData,
    searchInput,
    isSearchByUserLoading,
    isSearchByAdminAndCompanyLoading,
    didYouMean,
  } = useJobsPaginationAndSearch({
    // data: allJobs?.jobs,
    data: allJobs,
    placeholder: "Search by : Title, Company, Domain, Role, Technology",
  });

  // const handleOpenToWork = () => {
  //   if (!loggedInUserToken) {
  //     toast.success("Login to apply for open to work.");
  //     return router.push("/employee/login");
  //   }
  //   close();
  // };

  useEffect(() => {
    setActivePage(currentPage);
  }, [allJobs, currentPage]);

  // console.log("first", search, displayedData?.length);

  return (
    <>
      <div id="top_search" className="max-w-[45rem] mx-auto px-4">{searchInput}</div>
      {(isLoading ||
        isSearchByUserLoading ||
        isSearchByAdminAndCompanyLoading) && (
        <div className="mx-4">
          <Skeleton className="layout-container min-h-screen rounded-xl">
            <Skeleton className=" py-10 lg:text-left lg:pl-36 text-center" />
            <Skeleton className="w-full border-2" />
            <div className=" flex justify-center flex-wrap md:gap-10 gap-6 p-7">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-60 bg-gray-400 rounded-3xl h-44"
                />
              ))}
            </div>
          </Skeleton>
        </div>
      )}

      {search && !!didYouMean?.length && (
        <center className="text-lg text-gray-600 -my-4 mb-6">
          Did you mean:{" "}
          {didYouMean.map((word, index) => (
            <button
              key={index}
              className="font-semibold hover:underline underline-offset-1 pr-2"
              onClick={() => setSearch(word)}
            >
              {word},
            </button>
          ))}
        </center>
      )}

      {/* open to work */}
      {/* {!isLoading &&
        search &&
        didYouMean &&
        (displayedData?.length === 0 || displayedData === undefined) && (
          <OpenToWork />
        )} */}

      {/* fallback if no suggested word is found to recommend for typo error in search input */}
      {/* {!isLoading &&
        search &&
        !didYouMean &&
        (displayedData?.length === 0 || displayedData === undefined) && (
          <OpenToWork />
        )} */}

      {/* Rendering user jobs and passing to user jobs card */}
      {!isLoading && isSuccess && !!displayedData?.length && (
        <>
          <div className="mx-4">
            <UserJobCardList jobs={displayedData} />
          </div>

          {/* removed for now */}
          {/* Pagination buttons */}
          {/* <Pagination
            dataPerPage={15}
            totalData={allJobs?.jobsCount || 0}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          /> */}
        </>
      )}

      {/* if no jobs then rendering this no job found */}
      {!isLoading && !allJobs?.length && (
        <>
          <center className="text-gray-600 text-2xl font-semibold pt-10">
            <Image
              src="/images/no-search-result.svg"
              width={180}
              height={180}
              alt="not-found"
            />
            No job found
          </center>
        </>
      )}
    </>
  );
}

//rendering all the jobs here
const UserJobCardList = ({ jobs }: { jobs: Job[] }) => {
  return (
    <>
      <section className="layout-container min-h-screen rounded-xl bg-gradient-to-b from-[#0f5288] to-[#66ADDC]">
        <h1 className="text-white text-4xl font-semibold py-5 lg:text-left lg:pl-36 text-center">
          Job Listings
        </h1>
        <hr className="w-full border-2"></hr>
        <div className="flex justify-center flex-wrap md:gap-10 gap-6 p-7">
          {jobs && jobs.map((job) => <UserJobCard key={job._id} job={job} />)}
        </div>
      </section>
    </>
  );
};
