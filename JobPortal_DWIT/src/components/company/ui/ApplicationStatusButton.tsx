import { CircleCheck, CircleX, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ApplicationStatusButton = () => {
  const pathname = usePathname();
  const activePage = pathname.split("/").pop();
  return (
    <div className="text-sm flex gap-2">
      {activePage !== "job-applications" && (
        <Link
          className="bg-custom-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md flex items-center gap-2"
          href="/company/view/job-applications"
        >
          <Clock className="w-5 h-5" />
          Pending
        </Link>
      )}
      {activePage !== "rejected" && (
        <Link
          className="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          href="/company/view/job-applications/rejected"
        >
          <CircleX className="w-5 h-5" />
          Rejected
        </Link>
      )}
      {activePage !== "accepted" && (
        <Link
          className="bg-green-600 hover:bg-green-600/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          href="/company/view/job-applications/accepted"
        >
          <CircleCheck className="w-5 h-5 " />
          Accepted
        </Link>
      )}
    </div>
  );
};

export default ApplicationStatusButton;
