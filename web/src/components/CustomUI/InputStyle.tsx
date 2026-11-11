import React from "react";

type InputInterface = React.ComponentProps<"input"> & {
  state?: "default" | "disabled";
  placeholder: string;
};

const InputStyle = React.forwardRef<HTMLInputElement, InputInterface>(
  function InputStyle({ placeholder, state, ...restInputProps }, ref) {
    return (
      <input
        {...restInputProps}
        ref={ref}
        className="w-full min-w-0 h-[44px] px-4 text-sm rounded-md border border-border bg-container text-text placeholder:text-muted outline-none transition-colors duration-200 hover:border-muted focus:border-ink disabled:bg-secondary disabled:text-muted dark:border-border-dark dark:bg-container-dark dark:text-text-dark dark:placeholder:text-muted-dark dark:hover:border-muted-dark dark:focus:border-ink-dark dark:disabled:bg-secondary-dark dark:disabled:text-muted-dark"
        placeholder={placeholder}
      ></input>
    );
  }
);

export default InputStyle;
