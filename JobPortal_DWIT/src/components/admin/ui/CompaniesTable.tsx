import { RegisteredCompanies } from "@/lib/types";
import React from "react";
import NoDataFound from "@/components/ui/NoDataFound";

interface CompaniesTableProps {
  CardComponent: React.ElementType; // The card component to render
  currentRegisteredCompanies: RegisteredCompanies[];
  currentPage: number;
  dataPerPage: number;
}

const CompaniesTable = ({
  currentRegisteredCompanies,
  CardComponent,
  currentPage,
  dataPerPage,
}: CompaniesTableProps) => {
  return (
    <>
      {currentRegisteredCompanies.length > 0 ? (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full border-collapse text-center">
            <thead className="bg-[#E8EEF3] border">
              <tr className="h-16 text-left">
                <th className="px-4">S.N.</th>
                <th className="px-4">Name</th>
                <th className="px-4">Email</th>
                <th className="px-4 text-nowrap">Website url</th>
                <th className="px-4">Address</th>
                <th className="px-4 text-nowrap">Pan Image</th>
                <th className="px-4 text-nowrap">Pan Number</th>
                <th className="px-4 text-nowrap">Contact Number</th>
                <th className="px-4">Domain</th>
                <th className="px-4">Status</th>
                <th className="px-4">Verify</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentRegisteredCompanies &&
                currentRegisteredCompanies.map(
                  (company: RegisteredCompanies, index: number) => (
                    <CardComponent
                      key={company._id}
                      company={company}
                      index={index}
                      currentPage={currentPage}
                      dataPerPage={dataPerPage}
                    />
                  )
                )}
            </tbody>
          </table>
        </div>
      ) : (
        <NoDataFound />
      )}
    </>
  );
};

export default CompaniesTable;
