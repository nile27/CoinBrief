"use client";
import { useState, useEffect } from "react";

const CoinImg = ({ name, symbol }: { name: string; symbol: string }) => {
  const [src, setSrc] = useState("/Group.png");

  useEffect(() => {
    setSrc(`${process.env.NEXT_PUBLIC_IMAGE_URL}${symbol.toUpperCase()}.png`);
  }, [symbol]);

  const addDefaultImg = () => {
    setSrc("/Group.png");
  };

  return (
    <div className="w-[32px] h-[32px] tablet:hidden rounded-full  dark:bg-container flex justify-center items-center">
      <img
        src={src}
        alt={`${name} Logo`}
        className="w-[25px] h-[25px]  "
        onError={addDefaultImg}
      />
    </div>
  );
};

export default CoinImg;
