import React from "react";

type InputInterface = React.ComponentProps<"input"> & {
  placeholder: string;
};

const InputStyle = ({ placeholder, ...restInputProps }: InputInterface) => {
  return (
    <input
      {...restInputProps}
      className={` w-full min-w-[300px] h-[40px] pl-4 dark:bg-container-dark bg-container text-sm text-text dark:text-text-dark rounded-md border-[2px] dark:border-[0px] outline-none `}
      placeholder={placeholder}
    ></input>
  );
};

export default InputStyle;
