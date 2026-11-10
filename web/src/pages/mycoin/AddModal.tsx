import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import InputStyle from "@/components/CustomUI/InputStyle";
import { useUserStore, useSearchData } from "@/store/store";
import { useAddCoin } from "@/lib/mutations";

interface Coin {
  id: string;
  symbol: string;
}

const AddModal = ({
  setIsModal,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const add = useAddCoin();
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

  const handleSelectCoin = (coin: Coin) => {
    setIsModal(false);
    if (useUserStore.getState().user.mycoin.some((c) => c.id === coin.id)) return;
    add.mutate({ id: coin.id, name: coin.id, symbol: coin.symbol });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => setIsModal(false)}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div
        className="w-[90%] max-w-lg p-6 rounded-[10px] border border-border dark:border-border-dark bg-container dark:bg-container-dark relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModal(false)}
          className="absolute top-4 right-4"
        >
          <CircleX className="text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark" />
        </button>
        <h2 className="font-serif text-xl font-semibold text-ink dark:text-ink-dark mb-4">내 코인 추가</h2>
        <InputStyle
          autoComplete="off"
          placeholder="코인의 이름 또는 심볼로 검색해주세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="w-full border border-border dark:border-border-dark rounded-md max-h-60 overflow-auto mt-2">
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
