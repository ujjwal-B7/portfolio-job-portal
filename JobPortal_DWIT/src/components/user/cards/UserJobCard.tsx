import Link from "next/link";

import Image from "next/image";

import { Job } from "@/lib/types";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useState } from "react";

interface GenerateSlugProps {
  jobId: string;
  jobName: string;
}

const UserJobCard = ({ job }: { job: Job }) => {
  const { loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  const [imageSrc, setImageSrc] = useState(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${
      job?.companyId ? job?.companyId?.logo : job?.profileId?.logo
    }`
  );

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US");
  };

  return (
    <Link
      href={`/job/${job?._id}`}
      target="_blank"
      className="w-60 bg-white rounded-3xl px-4 py-6 shadow-white shadow"
      data-aos="zoom-in"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 border-custom-blue border-2 rounded-full flex-shrink-0 relative">
          <Image
            src={imageSrc}
            alt="Company Logo"
            fill
            priority
            className="rounded-full object-cover"
            onError={() => setImageSrc("/images/office-building.png")}
          />
        </div>
        <p className="primary-text capitalize">
          {job?.companyId
            ? job?.companyId?.company?.length > 29
              ? job?.companyId?.company?.substring(0, 25) + " ..."
              : job?.companyId?.company
            : job?.profileId?.name?.length > 29
            ? job?.profileId?.name?.substring(0, 25) + " ..."
            : job?.profileId?.name}
        </p>
      </div>
      <div>
        <p className="primary-text text-sm pt-3 pb-2 font-arial-rounded-bold capitalize">
          {job?.title?.length > 20
            ? job?.title.substring(0, 24) + " ..."
            : job?.title}
        </p>
        <p className="text-sm capitalize">Role : {job?.role}</p>
        <p className="text-sm py-2">
          Application Deadline :{" "}
          <span className="text-[12px]">
            {formatDate(job?.applicationDeadline)}
          </span>
        </p>

        {/* <button className="bg-hover-blue hover:bg-custom-blue text-white rounded-md w-full h-9 flex items-center justify-center mt-2 text-sm">
            Apply Now
          </button> */}
      </div>
    </Link>
  );
};

export default UserJobCard;
