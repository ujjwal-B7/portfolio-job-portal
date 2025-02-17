import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { CircleCheck, CircleX, Clock, EyeOff } from "lucide-react";

const CompaniesStatusButton = () => {
  const pathname = usePathname();
  const activePage = pathname.split("/").pop();
  return (
    <div className="flex flex-wrap gap-2">
      {activePage !== "pending" && (
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md flex items-center gap-2"
          href="/admin/view/registeredCompanies/pending"
        >
          <Clock className="w-5 h-5" />
          Pending
        </Link>
      )}
      {activePage !== "rejected" && (
        <Link
          className="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          href="/admin/view/registeredCompanies/rejected"
        >
          <CircleX className="w-5 h-5" />
          Rejected
        </Link>
      )}
      {activePage !== "activated" && (
        <Link
          className="bg-green-600 hover:bg-green-600/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          href="/admin/view/registeredCompanies/activated"
        >
          <CircleCheck className="w-5 h-5 " />
          Activated
        </Link>
      )}
      {activePage !== "deactivated" && (
        <Link
          className="bg-gray-900 hover:bg-gray-900/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          href="/admin/view/registeredCompanies/deactivated"
        >
          <EyeOff className="w-5 h-5" />
          Deactivated
        </Link>
      )}
    </div>
  );
};

export default CompaniesStatusButton;
