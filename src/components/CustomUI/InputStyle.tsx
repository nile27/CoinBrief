import React from "react";

interface InputInterface {
  placeholder: string;
}

const InputStyle = ({ placeholder }: InputInterface) => {
  return (
    <input
      className={`w-[300px] h-[40px] pl-4 dark:bg-container-dark bg-container text-text dark:text-text-dark rounded-md border-[2px] dark:border-[0px]  `}
      placeholder={placeholder}
    ></input>
  );
};

export default InputStyle;
