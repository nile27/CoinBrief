"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CoinImg from "@/components/CustomUI/CoinImg";
import { Search } from "lucide-react";
import { ProcessedCoin } from "@/type/type";

interface Coin {
  korean_name: string;
  symbol: string;
}

const SearchInput = ({ allCoins }: { allCoins: ProcessedCoin[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const router = useRouter();

  const handleSearch = (coin: Coin) => {
    router.push(`/detailcoin/${coin.symbol}/${coin.korean_name}`);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim().length >= 2) {
      const results: Coin[] = allCoins.filter(
        (coin: ProcessedCoin) =>
          coin.korean_name.includes(value) ||
          coin.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCoins(results);
    } else {
      setFilteredCoins([]);
    }
  };
  const handleBlur = () => {
    setSearchTerm("");
    setFilteredCoins([]);
  };

  return (
    <div className="relative w-[300px] ">
      <div className="w-full flex px-2 bg-container dark:bg-container-dark items-center">
        <Search width={20} height={20} />
        <input
          type="text"
          placeholder="코인 이름 또는 심볼 검색"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleBlur}
          className="w-full px-4 py-2  rounded outline-none bg-container dark:bg-container-dark "
        />
      </div>

      {filteredCoins.length > 0 && (
        <ul className="absolute top-full left-0 z-10 w-full bg-container dark:bg-container-dark border border-border dark:border-border-dark rounded shadow-md max-h-60 overflow-auto">
          {filteredCoins.map((coin: Coin, idx: number) => (
            <li
              key={idx}
              className="flex gap-3 items-center px-4 py-2 dark:hover:bg-hover-dark hover:bg-hover cursor-pointer"
              onClick={() => handleSearch(coin)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <CoinImg name={coin.korean_name} symbol={coin.symbol} />

              <span className="flex-1">{coin.korean_name}</span>
              <span className="">{coin.symbol}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
