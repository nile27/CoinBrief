"use client";
import InputStyle from "@/components/CustomUI/InputStyle";
import { CircleX } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "@/store/store";

interface Coin {
  id: string;
  name: string;
  symbol: string;
}

const AddModal = ({
  setIsModal,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, Addcoin, deleteCoin } = useUserStore();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const searchFetch = async (query: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `https://api.coinpaprika.com/v1/search?q=${query}&c=currencies&limit=10`
        );

        if (!res.ok) {
          throw new Error("검색에 실패하였습니다.");
        }

        const data = await res.json();
        const coins = data.currencies.map((coin: Coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
        }));

        setResults(coins);
      } catch (err) {
        console.error("검색 fetch Error:", err);
        setError("검색에 실패하였습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (search.length >= 2) {
      debounceTimeout.current = setTimeout(() => {
        searchFetch(search);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [search]);

  const handleSelectCoin = async (coin: Coin) => {
    await Addcoin({ id: coin.id, name: coin.name, symbol: coin.symbol });
    setSearch("");
    setResults([]);
  };

  const handleDeleteCoin = async (idx: number) => {
    await deleteCoin(idx);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => setIsModal(false)}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div
        className="flex flex-row gap-6 justify-between items-start bg-background dark:bg-background-dark w-[90%] min-h-[300px] max-w-4xl p-6 rounded-lg z-60 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModal(false)}
          className="absolute top-4 right-4 "
        >
          <CircleX className="  text-gray-500 hover:text-red-500 " />
        </button>

        <div className="flex-1 flex flex-col gap-3">
          <h2 className="text-lg font-bold">내 코인 추가</h2>
          <InputStyle
            placeholder="코인 영문 이름, 심볼로 검색해주세요."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isLoading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul className="w-full border rounded-lg max-h-[140px] overflow-hidden  overflow-y-auto bg-background dark:bg-background-dark">
            {results.map((coin) => (
              <li
                key={coin.symbol}
                className="px-4 py-2 bg-transparent hover:bg-hover dark:hover:bg-hover-dark cursor-pointer"
                onClick={() => handleSelectCoin(coin)}
              >
                {coin.name} ({coin.symbol.toUpperCase()})
              </li>
            ))}
            {!isLoading && results.length === 0 && search.length >= 2 && (
              <li className="px-4 py-2 text-gray-500">검색 결과가 없습니다.</li>
            )}
          </ul>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <h2 className="text-lg font-bold">My Coins</h2>
          <ul className="w-full border rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-background dark:bg-background-dark">
            {user.mycoin.map((coin, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center px-4 py-2 bg-transparent "
              >
                <span>{coin.name}</span>
                <button
                  onClick={() => handleDeleteCoin(idx)}
                  className=" hover:underline"
                >
                  <CircleX className="  text-gray-500 hover:text-red-500 " />
                </button>
              </li>
            ))}
            {user.mycoin.length === 0 && (
              <li className="px-4 py-2 text-gray-500">
                등록된 코인이 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
