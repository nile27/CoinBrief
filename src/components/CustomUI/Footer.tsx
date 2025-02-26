import React from "react";

const Footer = () => {
  return (
    <div className=" bottom-0 w-full h-[8%] dark:bg-background-dark bg-background flex justify-between items-center gap-[10%] px-[20%] mobile:hidden">
      <span>2024.12.15</span>
      <div className=" flex justify-center items-center w-auto h-full p-2 gap-10">
        <a
          className="w-auto h-auto"
          target="_blank"
          href="https://www.figma.com/design/xxO2ItVjjcXe3QsYKTmkPR/coin_project?node-id=4-2&p=f&t=DBAnGhVx8fhAQNCT-0"
        >
          Figma
        </a>
        <a
          className="w-auto h-auto"
          target="_blank"
          href="https://github.com/nile27/CoinBrief"
        >
          Github
        </a>
      </div>
    </div>
  );
};

export default Footer;
