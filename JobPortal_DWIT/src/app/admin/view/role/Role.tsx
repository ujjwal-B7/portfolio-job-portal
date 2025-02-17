"use client";
import Link from "next/link";
import { Role } from "@/lib/types";

import { useGetAllRolesQuery } from "@/lib/store/features/roleApi";

import Pagination from "@/components/ui/Pagination";
import RoleCard from "@/components/adminAndCompany/cards/RoleCard";
import { CirclePlus } from "lucide-react";
import NoDataFound from "@/components/ui/NoDataFound";
import { usePaginationAndSearch } from "@/hooks/usePaginationAndSearch";
import LayoutLoader from "@/components/ui/LayoutLoader";

export default function RolePage() {
  const {
    data: allRoles,
    isLoading: isRoleLoading,
    isError,
  } = useGetAllRolesQuery({});

  const {
    currentData: currentRoles,
    currentPage,
    setCurrentPage,
    dataPerPage,
    search,
    displayedData,
    searchInput,
  } = usePaginationAndSearch<Role>({
    data: allRoles,
    dataPerPage: 15,
    searchKeys: ["role"],
    placeholder: "Search by: Role",
  });

  return (
    <>
      {searchInput}
      <div className="bg-white flex justify-between rounded-tl-lg rounded-tr-lg py-6 px-4 border-b-2 border-[#0F5288] sticky top-[4.2rem]">
        <h2 className="font-semibold sm:text-3xl text-2xl primary-text">
          Roles
        </h2>
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-lg sm:text-base text-sm flex items-center gap-2"
          href="/admin/add/role"
        >
          <CirclePlus className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>
      {/* loader */}
      {isRoleLoading && (
        <div className="w-full h-[calc(50vh)] flex items-center  justify-center">
          <LayoutLoader />
        </div>
      )}

      {!isRoleLoading && currentRoles?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 ">
                <th className="px-2 ">S.N.</th>
                <th className="px-2  w-[70%]">Role</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentRoles &&
                currentRoles.map((role: Role, index: number) => (
                  <RoleCard
                    key={role._id}
                    role={role}
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

      {!isRoleLoading && !allRoles?.length && <NoDataFound />}

      {/* pagination component */}
      {!isRoleLoading && displayedData?.length > 15 && (
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
