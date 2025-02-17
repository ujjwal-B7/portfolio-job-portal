"use client";

import useToggle from "@/hooks/useToggle";
import { Job } from "@/lib/types";
import {
  ForwardedRef,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { UseFormSetValue } from "react-hook-form";

interface Props {
  id: keyof Job;
  type: string;
  label: string;
  error?: string;
  options?: any;
  value?: string;
  setDescriptionValueRecievedAsProp?: (value: CompanyDetailsProps) => void;

  setValue: UseFormSetValue<Job>;
  [key: string]: any;
}

interface CompanyDetailsProps {
  _id: string;
  company: string;
  description: string;
  logo: string;
  numeric?: boolean;
}

const JobInput = forwardRef(
  (
    {
      id,
      type,
      label,
      error,
      options,
      setDescriptionValueRecievedAsProp,
      setValue,
      value,
      numeric,
      ...rest
    }: Props,
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const [showOptions, setShowOptions, setCloseOptions] = useToggle();
    const [showfilteredOptions, setShowFilteredOptions] = useState(options);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
      null
    );
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setCloseOptions();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
    }, [inputRef, setCloseOptions]);

    const handleOptionClick = (optionTitle: string) => {
      if (inputRef.current) {
        setValue(id, optionTitle, { shouldDirty: true });
        // inputRef.current.value = optionTitle;
        const company_details: CompanyDetailsProps = options.find(
          (option: CompanyDetailsProps) => option.company === optionTitle
        );

        if (setDescriptionValueRecievedAsProp)
          setDescriptionValueRecievedAsProp(company_details);
        setShowOptions();
      }
    };

    const handleSearchTitles = (searchTerm: string) => {
      const filtered = options.filter((option: any) =>
        [
          option.title,
          option.technology,
          option.company,
          option.domain,
          option.salary,
          option.types,
          option.role,
        ]
          .filter(Boolean) // filter out undefined values
          .some((field) =>
            field?.toLowerCase().includes(searchTerm.toLowerCase().trim())
          )
      );

      setShowFilteredOptions(filtered);
    };

    // Replace non-numeric characters with an empty string
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    };

    return (
      <>
        <div className="z-1">
          <label htmlFor={id} className=" mb-1">
            {label}
          </label>{" "}
          <br />
          <input
            ref={(element) => {
              ref && (ref as any)(element);
              inputRef.current = element;
            }}
            {...rest}
            id={id}
            type={type}
            className="border-2 border-[#c7c7c7] rounded-md px-4 py-2 focus:outline-none focus:ring-[0.1px] focus:ring-custom-blue  mb-1 w-full"
            placeholder={label}
            onFocus={setShowOptions}
            onChange={(e: any) => handleSearchTitles(e.target.value)}
            onInput={numeric ? handleNumberInput : undefined}
          />
          {showOptions && (
            <div
              className="absolute z-50 w-full max-w-[27rem] h-60 overflow-y-auto bg-white shadow-lg space-y-2 p-2 rounded-md cursor-pointer divide-y-2"
              ref={dropdownRef}
            >
              {showfilteredOptions?.map((option: any, index: number) => (
                <div key={option._id}>
                  <p
                    className="p-2  hover:bg-hover-light rounded-md mt-2"
                    onClick={() =>
                      handleOptionClick(
                        option.title ||
                          option.technology ||
                          option.company ||
                          option.domain ||
                          option.salary ||
                          option.types ||
                          option.role
                      )
                    }
                  >
                    {option.title}
                    {option.technology}
                    {option.company}
                    {option.domain}
                    {option.salary}
                    {option.types}
                    {option.role}
                  </p>
                </div>
              ))}

              {!showfilteredOptions?.length && (
                <p className="text-gray-500 text-center pt-20">
                  No data available.
                </p>
              )}
            </div>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </>
    );
  }
);

JobInput.displayName = "JobInput";

export default JobInput;
