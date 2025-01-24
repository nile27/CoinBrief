import React from "react";

const Footer = () => {
  return (
    <div className=" bottom-0 w-full h-[8%] dark:bg-background-dark bg-background flex justify-between items-center gap-[10%] px-[20%] mobile:hidden">
      <span>2024.12.15</span>
      <div className=" flex justify-center w-auto h-full p-2 gap-10">
        <button>Figma</button>
        <button>Github</button>
      </div>
    </div>
  );
};

export default Footer;
