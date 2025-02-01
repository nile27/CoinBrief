"use client";
import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import InputStyle from "@/components/CustomUI/InputStyle";
import { useUserStore, useSearchData } from "@/store/store";
import { searchCoinBySymbol } from "../utill/utill";
interface Coin {
  id: string;

  symbol: string;
}

const AddModal = ({
  setIsModal,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { Addcoin } = useUserStore();
  const { data } = useSearchData();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Coin[]>([]);

  useEffect(() => {
    const filteredResults: Coin[] = data.filter((coin: Coin) =>
      coin.symbol.toUpperCase().includes(search.toUpperCase())
    );
    setResults(filteredResults);
  }, [search]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSelectCoin = async (coin: Coin) => {
    try {
      setIsModal(false);
      const data = await searchCoinBySymbol(coin.symbol);

      await Addcoin({
        id: data[0].id,
        name: data[0].name,
        symbol: data[0].symbol,
      });

      setSearch("");
      setResults([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => setIsModal(false)}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div
        className="bg-background dark:bg-background-dark w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModal(false)}
          className="absolute top-4 right-4"
        >
          <CircleX className="text-gray-500 hover:text-red-500" />
        </button>
        <h2 className="text-lg font-bold mb-4">내 코인 추가</h2>
        <InputStyle
          placeholder="코인의 이름 또는 심볼로 검색해주세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="w-full border rounded-lg max-h-60 overflow-auto bg-background dark:bg-background-dark mt-2">
          {results.map((coin: Coin) => (
            <li
              key={coin.symbol}
              className="px-4 py-2 cursor-pointer border-b  border-border dark:border-border-dark hover:bg-hover hover:dark:bg-hover-dark"
              onClick={() => handleSelectCoin(coin)}
            >
              {coin.symbol.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddModal;
