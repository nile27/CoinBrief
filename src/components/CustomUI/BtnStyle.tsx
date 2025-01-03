import React from "react";

interface BtnInterface {
  width: string;
  height: string;
  children: any;
}

const BtnStyle = ({ width, height, children }: BtnInterface) => {
  return (
    <button
      className={`text-white bg-btn dark:bg-btn-dark w-${width} h-${height} hover:bg-hover dark:hover:bg-hover-dark font-semibold rounded-[10px]`}
    >
      {children}
    </button>
  );
};

export default BtnStyle;
