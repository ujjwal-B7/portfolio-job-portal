import { JobApplication } from "@/lib/types";
import React from "react";

interface ApplicationCardProps {
  application: JobApplication;
  sn: number;
}

const ApplicationCard = ({ application, sn }: ApplicationCardProps) => {
  return (
    <tr
      key={application._id}
      className={`border w-full text-left text-nowrap
}`}
    >
      <td className="px-4 py-4">
        <p className="">{++sn}</p>
      </td>
      <td className="px-4 py-4">
        <p className="">
          {application.jobId.companyId
            ? application.jobId.companyId.company
            : application.jobId.profileId?.name}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="">{application.jobId.title}</p>
      </td>
      <td className="px-4 py-4">
        <p className="">{application.jobId.role}</p>
      </td>
      <td className="px-4 py-4">
        <p className="tabular-nums">{application.createdAt.split("T")[0]}</p>
      </td>
    </tr>
  );
};

export default ApplicationCard;
