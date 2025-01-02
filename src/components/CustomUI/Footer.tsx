import React from "react";

const Footer = () => {
  return (
    <div className=" w-full h-[4.3rem] dark:bg-background-dark bg-background flex justify-between items-center gap-[10em] px-[16rem]">
      <span>2024.12.15</span>
      <div className=" flex justify-center w-auto h-full p-2 gap-10">
        <button>Figma</button>
        <button>GitHub</button>
      </div>
    </div>
  );
};

export default Footer;
