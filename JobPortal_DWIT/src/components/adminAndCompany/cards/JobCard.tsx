import { Job } from "@/lib/types";
import Link from "next/link";
import { useDeleteJobMutation } from "@/lib/store/features/jobsApi";
import { toast } from "react-toastify";

import useToggle from "@/hooks/useToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { PopupModal } from "@/components/modal/PopupModal";

interface JobCardProps {
  job: Job;
  index: number;
  currentPage: number;
  dataPerPage: number;
}

const JobCard = ({ job, index, currentPage, dataPerPage }: JobCardProps) => {
  const serialNumber = (currentPage - 1) * dataPerPage + (index + 1);

  const { role } = useSelector((state: RootState) => state.authenticated);

  const [openModal, setOpenModal] = useToggle();
  const [deleteJob, { isLoading: isDeleteJobLoading }] = useDeleteJobMutation();

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US");
  };

  //delete job here
  const handleDeleteJob = async () => {
    try {
      await deleteJob(job._id);
      toast.success("Job deleted successfully");
      setOpenModal();
    } catch (error) {
      console.log("JOB_DELETION_ERROR", error);
    }
  };

  // comparing today date with application deadline
  const applicationDeadline = new Date(job.applicationDeadline);
  const todayDate = new Date();

  return (
    <>
      <tr
        key={job._id}
        className={`border capitalize ${
          todayDate >= applicationDeadline ? "text-danger" : ""
        }`}
      >
        <td className="px-4 py-2">
          <p className="">{serialNumber}</p>
        </td>
        <td className="px-4 py-2">
          <p className="truncate">{job.title}</p>
        </td>
        {role === "admin" && (
          <td className="px-4 py-2">
            <p className=" truncate">{job?.companyId?.company}</p>
          </td>
        )}
        <td className="px-4 py-2">
          <p className=" truncate">{job.domain}</p>
        </td>
        <td className="px-4 py-2">
          <p className=" truncate">{job.technology}</p>
        </td>
        <td className="px-4 py-2">
          <p className=" truncate">{job.role}</p>
        </td>
        <td className="px-4 py-2 ">
          <p className="truncate">{job.salary}</p>
        </td>
        <td className="px-4 py-2 ">
          <p className="truncate">{formatDate(job.applicationStart)}</p>
        </td>
        <td className="px-4 py-2">
          <p className="truncate">{formatDate(job.applicationDeadline)}</p>
        </td>
        <td className="px-4 py-2 text-center">
          <div className="flex justify-center space-x-4">
            <button
              className=" hover:bg-danger hover:text-white text-danger font-bold py-2 px-4 rounded border-2 border-danger"
              onClick={setOpenModal}
            >
              Delete
            </button>
            <Link
              href={`/${role}/update/job/${job._id}`}
              className=" hover:bg-[#3573A3] hover:text-white text-[#3573A3] font-bold py-2 px-4 rounded border-2 border-[#3573A3]"
            >
              Update
            </Link>
          </div>
        </td>
      </tr>

      {/* Job delete modal */}
      <PopupModal
        type="delete"
        openModal={openModal}
        setOpenModal={setOpenModal}
        displayName={job.title}
        handleFunction={handleDeleteJob}
        isLoading={isDeleteJobLoading}
      />
    </>
  );
};

export default JobCard;
