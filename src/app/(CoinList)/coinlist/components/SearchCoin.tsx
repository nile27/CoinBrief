"use client";
import InputStyle from "@/components/CustomUI/InputStyle";
import { CoinList } from "../page";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchCoin = ({ coinList }: { coinList: CoinList[] }) => {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState<CoinList[]>([]);

  useEffect(() => {
    const handleSearch = () => {
      const filterArr: CoinList[] = [...coinList].filter((coin: CoinList) => {
        if (
          coin.name.includes(search.toLowerCase()) ||
          coin.symbol.includes(search.toLowerCase())
        )
          return (
            coin.name.includes(search.toLowerCase()) ||
            coin.symbol.includes(search.toLowerCase())
          );
      });

      setFilterValue(filterArr);
    };
    handleSearch();
  }, [search]);

  return (
    <div className="w-[400px] h-[40px] flex justify-start item-center ml-1 px-2 mb-1 rounded-t-md bg-container dark:bg-container-dark relative">
      <button className="w-[35px] h-[auto] rounded-lg bg-transparent hover:opacity-[0.6] ">
        <Search className="w-[30px] h-[24px] text-text dark:text-text-dark" />
      </button>
      <InputStyle
        placeholder="코인 이름, 심볼로 검색해주세요."
        onChange={(e) => setSearch(e.target.value)}
      />

      <div
        hidden={filterValue.length === 0 || search.length === 0}
        className=" pl-[55px] absolute top-10 left-0 w-full  bg-container dark:bg-container-dark  max-h-[200px] overflow-y-auto  "
      >
        {filterValue.map((item: CoinList, key: number) => {
          return (
            <li key={key} className={`flex justify-start items-center w-full `}>
              {item.name + " " + item.symbol}
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default SearchCoin;
