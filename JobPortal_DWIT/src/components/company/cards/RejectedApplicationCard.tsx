import { JobApplication } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { CircleX, FileText } from "lucide-react";
import useToggle from "@/hooks/useToggle";

const RejectedApplicationCard = ({
  application,
}: {
  application: JobApplication;
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [showPdfPopupModal, setShowPdfPopupModal, setClosePdfPopupModal] =
    useToggle();
  const [pdfToShow, setShowPdfToShow] = useToggle();

  // ref
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
      <ol className="relative border-s ml-3 border-gray-200 dark:border-gray-700 pt-4">
        <li className="pb-10 ms-6 flex flex-wrap items-start justify-between">
          <div>
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-1 ring-white mt-0.5">
              <svg
                className="w-3.5 h-3.5 text-custom-blue "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 ">
              {application.jobId.title}
              {/* {application.experience >= application.jobId.experience && ( */}
              <span className="bg-blue-200 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded ms-3">
                Rejected
              </span>
              {/* )} */}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
              {application.createdAt.split("T")[0]}
            </time>
            <p className="text-base font-normal text-gray-500">
              Role: {application.jobId.role}
            </p>
            <div className="text-base text-gray-500 ">
              <p>Applicant Name: {application.applicantId?.name}</p>
              <p>Email: {application.applicantId?.email}</p>
              <p>Experience: {application.experience}</p>
              <p>Contact: {application.applicantId?.contact_number}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 "
              onClick={() => {
                setShowPdfPopupModal();
                setShowPdfToShow();
              }}
            >
              <FileText className="w-3.5 h-3.5 me-2" />
              View CV
            </button>
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 "
              onClick={() => {
                setShowPdfPopupModal();
                setShowPdfToShow();
              }}
            >
              <FileText className="w-3.5 h-3.5 me-2" />
              View Cover Letter
            </button>
            <button className="inline-flex items-center justify-center w-40 h-10 text-sm font-medium text-white bg-danger border border-gray-200 rounded-lg cursor-text">
              <CircleX className="size-4 me-2" />
              Rejected
            </button>
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
    </>
  );
};

export default RejectedApplicationCard;
