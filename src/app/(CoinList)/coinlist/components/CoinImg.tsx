"use client";
import { useState, useEffect } from "react";

const CoinImg = ({ name, symbol }: { name: string; symbol: string }) => {
  const [src, setSrc] = useState("/Group.png");

  useEffect(() => {
    setSrc(`https://static.upbit.com/logos/${symbol.toUpperCase()}.png`);
  }, [symbol]);

  const addDefaultImg = () => {
    setSrc("/Group.png");
  };

  return (
    <div className="w-[30px] h-[30px] tablet:hidden rounded-full  dark:bg-container flex justify-center items-center">
      <img
        src={src}
        alt={`${name} Logo`}
        className="w-[22px] h-[22px]  "
        onError={addDefaultImg}
      />
    </div>
  );
};

export default CoinImg;
