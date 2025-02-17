import { JobApplication } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { CircleCheck, CircleX, FileText, UserRound } from "lucide-react";

import { useAcceptApplicantApplicationMutation } from "@/lib/store/features/jobApplicationApi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { toast } from "react-toastify";
import Link from "next/link";
import useToggle from "@/hooks/useToggle";
import { PopupModal } from "@/components/modal/PopupModal";

const ApplicationCard = ({ application }: { application: JobApplication }) => {
  const { name, role } = useSelector((state: RootState) => state.authenticated);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [showPdfPopupModal, setShowPdfPopupModal, setClosePdfPopupModal] =
    useToggle();
  const [pdfToShow, setShowPdfToShow] = useToggle();
  const [showMarkAsPopup, setShowMarkAsSentPopup] = useToggle();
  const [popupModalType, setShowPopupModalType] = useState("");

  const [
    isAcceptApplicantApplicationLoading,
    setIsAcceptApplicantApplicationLoading,
  ] = useToggle();
  const [
    isRejectApplicantApplicationLoading,
    setIsRejectApplicantApplicationLoading,
  ] = useToggle();
  const [
    isDispatchApplicantApplicationLoading,
    setIsDispatchApplicantApplicationLoading,
  ] = useToggle();

  const [
    acceptApplicantApplication,
    { isLoading: isAcceptApplicationLoading },
  ] = useAcceptApplicantApplicationMutation();

  // ref
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const sendApplicantAcceptedEmail = async () => {
    try {
      const applicationStatus =
        popupModalType === "accept"
          ? "accepted"
          : popupModalType === "reject"
          ? "rejected"
          : "dispatched";

      const applicantDetails = {
        applicantName: application.applicantId?.name,
        applicantEmail: application.applicantId?.email,
        application_status: applicationStatus,
        appliedRole: application.jobId.role,
        companyName: name,
      };

      const res = await acceptApplicantApplication({
        applicationId: application._id,
        applicantDetails,
      });

      toast.success(`Application ${applicationStatus}.`);
      setShowMarkAsSentPopup();
    } catch (error) {
      toast.warn("Internal server error.");
      console.log("APPLICANT_ACCEPTED_EMAIL_ERROR", error);
    }
  };

  // Close modal when clicking outside the viewer
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (pdfViewerRef.current && !pdfViewerRef.current.contains(target)) {
        setClosePdfPopupModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPdfPopupModal, setClosePdfPopupModal]);

  return (
    <>
      <ol className="relative border-s ml-3 border-gray-200 dark:border-gray-700 mt-4">
        <li className="mediumLareg:pb-10 pb-6 ms-6 flex flex-wrap items-start justify-between ">
          <div>
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-1 ring-white mt-0.5">
              <svg
                className="w-3.5 h-3.5 text-custom-blue"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
              {role === "admin" ? (
                <>
                  <div>
                    {application?.jobId?.companyId
                      ? application?.jobId?.companyId.company
                      : application?.jobId?.profileId?.name}{" "}
                    <br />
                    <span className="text-base text-gray-500 font-normal">
                      Title: {application?.jobId?.title}
                    </span>
                  </div>
                </>
              ) : (
                application?.jobId?.title
              )}
              {application?.experience >= application?.jobId.experience && (
                <span className="bg-blue-200 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded ms-3">
                  Highlighted
                </span>
              )}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
              {application.createdAt.split("T")[0]}
            </time>
            <p className="text-base font-normal text-gray-500">
              Role: {application?.jobId?.role}
            </p>
            <div className="text-base text-gray-500 ">
              <p>Applicant Name: {application?.applicantId?.name}</p>
              <p>Email: {application?.applicantId?.email}</p>
              <p>Experience: {application?.experience} years</p>

              {application?.applicantId?.contact_number && (
                <p>Contact: {application?.applicantId?.contact_number}</p>
              )}
            </div>
          </div>
          <div className=" flex mediumLarge:flex-col flex-wrap justify-between mediumLarge:h-40 gap-2 mediumLarge:mt-1 mt-4">
            <div className="flex flex-wrap gap-2">
              <Link href={`/profile/${application?.applicantId?._id}`}>
                <button className="inline-flex items-center px-4 py-2 text-nowrap h-fit text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 ">
                  <UserRound className="w-3.5 h-3.5 me-2" />
                  View Profile
                </button>
              </Link>
              <button
                className="inline-flex items-center px-4 py-2 text-nowrap h-fit text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 "
                onClick={() => {
                  setShowPdfPopupModal();
                  setShowPdfToShow();
                }}
              >
                <FileText className="w-3.5 h-3.5 me-2" />
                View CV
              </button>
              <button
                className="inline-flex items-center px-4 py-2 text-nowrap h-fit text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 "
                onClick={() => {
                  setShowPdfPopupModal();
                  setShowPdfToShow();
                }}
              >
                <FileText className="w-3.5 h-3.5 me-2" />
                View Cover Letter
              </button>
            </div>

            {role === "company" && (
              <div className="text-end space-x-2">
                <button
                  className="inline-flex items-center justify-center w-28 h-10 text-sm font-medium text-white bg-danger border border-gray-200 rounded-lg hover:bg-danger/80"
                  onClick={() => {
                    setShowMarkAsSentPopup();
                    setShowPopupModalType("reject");
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                  </svg>{" "}
                  Reject
                </button>
                <button
                  className="inline-flex items-center justify-center w-28 h-10 text-sm font-medium text-white bg-custom-blue border border-gray-200 rounded-lg hover:bg-hover-blue"
                  onClick={() => {
                    setShowMarkAsSentPopup();
                    setShowPopupModalType("accept");
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                  </svg>{" "}
                  Accept
                </button>
              </div>
            )}

            {role === "admin" && (
              <div className="text-end">
                <button
                  className="inline-flex items-center gap-2 justify-center w-32 h-10 text-sm font-medium text-white bg-custom-blue border border-gray-200 rounded-lg hover:bg-hover-blue"
                  onClick={() => {
                    setShowMarkAsSentPopup();
                    setShowPopupModalType("dispatch");
                  }}
                >
                  <CircleCheck className="w-5 h-5" />
                  Mark as sent
                </button>
              </div>
            )}
          </div>
        </li>
      </ol>
      <hr className="ms-10" />

      {/* pdf rendering */}
      {showPdfPopupModal && (
        <div
          ref={modalRef}
          className="cursor-pointer fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
        >
          <div
            ref={pdfViewerRef}
            className="w-[80%] h-[90vh] p-4 z-10 flex items-start"
            data-aos="zoom-in"
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                defaultScale={0.9}
                fileUrl={
                  pdfToShow
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${application.cv_pdf}`
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${application.cover_letter_pdf}`
                }
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>

            <button
              className="bg-slate-200 mt-[1px]"
              onClick={setShowPdfPopupModal}
            >
              <CircleX className="text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* mark as sent modal */}
      <PopupModal
        openModal={showMarkAsPopup}
        setOpenModal={setShowMarkAsSentPopup}
        handleFunction={sendApplicantAcceptedEmail}
        isLoading={isAcceptApplicationLoading}
        type={popupModalType}
      />
    </>
  );
};

export default ApplicationCard;
