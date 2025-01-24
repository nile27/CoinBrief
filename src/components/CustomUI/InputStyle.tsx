import React from "react";

type InputInterface = React.ComponentProps<"input"> & {
  state?: "default" | "disabled";
  placeholder: string;
};

const InputStyle = React.forwardRef<HTMLInputElement, InputInterface>(
  function InputStyle({ placeholder, ...restInputProps }, ref) {
    return (
      <input
        {...restInputProps}
        ref={ref}
        className={` disabled:dark:text-[rgba(228,228,235,0.59)] disabled:text-[rgba(113,113,113,0.59)] w-full min-w-[300px] h-[40px] pl-4 text-sm bg-container dark:bg-container-dark text-text dark:text-text-dark rounded-md border-[2px] dark:border-[0px] outline-none `}
        placeholder={placeholder}
      ></input>
    );
  }
);

export default InputStyle;
