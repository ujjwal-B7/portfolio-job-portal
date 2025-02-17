// "use client";
import { ForwardedRef, forwardRef } from "react";

interface Props {
  id: string;
  type: string;
  label: string;
  error?: string;
  numeric?: boolean;

  /* 
   [x:string] -> represents the key of object
   any -> represents the value of key
   for.eg: if we send age =20,boolean=true then the key is always string 'age','boolean' but the value could be number,boolean, so any type that means any value is acceptable
  */
  [key: string]: any;
}

const Input = forwardRef(
  (
    { id, type, label, error, numeric, ...rest }: Props,
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Replace non-numeric characters with an empty string
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    };

    return (
      <>
        <div>
          <label htmlFor={id} className="text-4 mb-1">
            {label}
          </label>{" "}
          <br /> 
          <input
            ref={ref as ForwardedRef<HTMLInputElement>}
            {...rest}
            id={id}          
            type={type}
            className="border-2 border-[#c7c7c7] rounded-md px-4 py-2 focus:outline-none focus:ring-[0.1px] focus:ring-custom-blue  mb-1 w-full"
            placeholder={label}
            onInput={numeric ? handleNumberInput : undefined}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
