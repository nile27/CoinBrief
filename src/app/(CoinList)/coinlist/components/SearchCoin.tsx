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
    <div className="relative z-30 w-[320px] max-w-full mobile:w-full">
      <div className="flex h-10 w-full items-center rounded-md border border-border bg-container px-3 focus-within:border-ink dark:border-border-dark dark:bg-container-dark dark:focus-within:border-ink-dark">
        <Search width={16} height={16} className="shrink-0 text-muted dark:text-muted-dark" />
        <input
          type="text"
          placeholder="코인 이름 또는 심볼 검색"
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted dark:placeholder:text-muted-dark"
        />
      </div>

      {filteredCoins.length > 0 && (
        <ul className="absolute top-full left-0 z-30 w-full bg-container dark:bg-container-dark border border-border dark:border-border-dark rounded-md shadow-sm max-h-60 overflow-auto">
          {filteredCoins.map((coin: Coin, idx: number) => (
            <li
              key={idx}
              className="flex gap-3 items-center px-4 py-2 text-sm dark:hover:bg-hover-dark hover:bg-hover cursor-pointer"
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
