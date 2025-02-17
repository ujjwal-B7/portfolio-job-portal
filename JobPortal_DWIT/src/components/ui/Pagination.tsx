import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  dataPerPage: number;
  totalData: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  dataPerPage,
  totalData,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalData / dataPerPage);
  return (
    <>
      <div className="flex justify-center gap-3 flex-wrap my-4">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 disabled:opacity-50 rounded"
        >
          <ChevronsLeft className="size-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 disabled:opacity-50 rounded"
        >
          <ChevronLeft className="size-4" />
        </button>
        {/* {totalData > 15 && */}
        {/* // [...Array(totalPages)].map((_, index) => ( */}
        <button
          // key={index}
          // onClick={() => onPageChange(index + 1)}
          // className={`px-3 py-1 rounded-md  border ${
          //   index + 1 === currentPage
          //     ? "bg-hover-blue   text-white"
          //     : " text-hover-blue bg-white"
          // }`}
          className="border border-gray-300 px-3 py-1 rounded-md"
        >
          {currentPage}
        </button>
        {/* // ))} */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-300 disabled:opacity-50 rounded"
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-300 disabled:opacity-50 rounded"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </>
  );
}

// import { AllDataUnion } from "@/lib/types";

// interface PaginationProps {
//   dataPerPage: number;
//   searchResult: AllDataUnion;
//   allData: AllDataUnion;
//   currentPage: number;
//   setCurrentPage: (value: number) => void;
// }

// const Pagination = ({
//   dataPerPage,
//   searchResult,
//   allData,
//   currentPage,
//   setCurrentPage,
// }: PaginationProps) => {
//   // Change page
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   return (
//     <div className="flex justify-center gap-3 flex-wrap my-4">
//       {Array.from(
//         {
//           length: Math.ceil(
//             searchResult?.length
//               ? searchResult?.length / dataPerPage
//               : allData?.length / dataPerPage
//           ),
//         },
//         (_, i) => (
//           <button
//             key={i}
//             onClick={() => paginate(i + 1)}
//             className={`px-3 py-1 rounded-md  border ${
//               i + 1 === currentPage
//                 ? "bg-hover-blue   text-white"
//                 : " text-hover-blue bg-white"
//             }`}
//           >
//             {i + 1}
//           </button>
//         )
//       )}
//     </div>
//   );
// };

// // export default Pagination;
