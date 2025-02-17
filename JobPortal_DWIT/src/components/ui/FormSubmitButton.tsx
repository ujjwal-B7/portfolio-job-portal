// components/FormSubmitButton.tsx
import React from "react";

interface FormSubmitButtonProps {
  isLoading: boolean;
  isCreateMode: boolean;
}

const FormSubmitButton = ({
  isLoading,
  isCreateMode,
}: FormSubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`bg-custom-blue hover:bg-hover-blue font-bold text-white h-10 sm:w-32 w-full rounded-md flex justify-center items-center gap-2 text-lg ${
        isLoading && "cursor-not-allowed"
      }`}
      disabled={isLoading}
    >
      {isCreateMode ? "Creat" : "Sav"}
      {isLoading ? (
        <>
          {"ing"}
          <span className="button-loader"></span>
        </>
      ) : (
        "e"
      )}
    </button>
  );
};

export default FormSubmitButton;
