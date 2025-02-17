import { Button, Modal } from "flowbite-react";
import { CircleCheck, Loader2 } from "lucide-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface PopupModalProps {
  openModal: boolean;
  setOpenModal: () => void;
  displayName?: string;
  handleFunction: () => void;
  isLoading: boolean;
  type: string;
}

export function PopupModal({
  openModal,
  setOpenModal,
  displayName,
  handleFunction,
  isLoading,
  type,
}: PopupModalProps) {
  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={setOpenModal}
        popup
        className="bg-black/40 zoom-out pt-44"
        position="center"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {type === "delete" ? (
              <HiOutlineExclamationCircle className="mx-auto mb-4 size-10 text-gray-400 dark:text-gray-200" />
            ) : (
              <CircleCheck className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            )}
            <h3 className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400">
              Are you sure, you want to {type} ? <br />
              <strong className="capitalize mt-1">{displayName}</strong>
            </h3>
            <div className="flex justify-center gap-4 ">
              <Button
                disabled={isLoading}
                onClick={handleFunction}
                className={`capitalize w-24 text-white flex items-center justify-center
                  ${isLoading && "cursor-not-allowed"}
                  ${type === "delete" ? "bg-danger" : "bg-success"}`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : type}
              </Button>
              <Button color="gray" onClick={setOpenModal}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
