import React from "react";
import AddCoinBox from "./AddCoinBox";

const HeaderCoinBox = () => {
  return (
    <header className="w-full h-auto min-h-[50px] px-14 flex justify-between items-center tablet:flex-col tablet:items-start">
      <h1 className="text-[30px] font-bold tablet:mb-4">내 코인</h1>
      <div className="flex gap-4 tablet:w-full tablet:justify-between">
        <AddCoinBox />
      </div>
    </header>
  );
};

export default HeaderCoinBox;
