import React from "react";
import AddCoinBox from "./AddCoinBox";

const HeaderCoinBox = () => {
  return (
    <header className="flex w-full items-center justify-between gap-4 mobile:flex-col mobile:items-start">
      <h1 className="font-serif text-[32px] font-semibold text-ink dark:text-ink-dark mobile:text-[26px]">
        내 코인
      </h1>
      <AddCoinBox />
    </header>
  );
};

export default HeaderCoinBox;
