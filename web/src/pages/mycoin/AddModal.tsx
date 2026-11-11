import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import InputStyle from "@/components/CustomUI/InputStyle";
import { useUserStore, useSearchData } from "@/store/store";
import { useAddCoin } from "@/lib/mutations";
import type { CoinSymbol } from "@/type/type";

const AddModal = ({
  setIsModal,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const add = useAddCoin();
  const { data } = useSearchData();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CoinSymbol[]>([]);

  useEffect(() => {
    const filteredResults: CoinSymbol[] = data.filter((coin: CoinSymbol) =>
      coin.symbol.toUpperCase().includes(search.toUpperCase())
    );
    setResults(filteredResults);
  }, [search, data]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const mycoin = useUserStore((s) => s.user.mycoin);
  const [message, setMessage] = useState("");
  const isAdded = (id: string) => mycoin.some((c) => c.id === id);

  const handleSelectCoin = (coin: CoinSymbol) => {
    if (isAdded(coin.id)) {
      setMessage("이미 등록된 코인입니다.");
      return;
    }
    setMessage("");
    add.mutate(
      { id: coin.id, name: coin.id, symbol: coin.symbol },
      {
        onSuccess: () => setIsModal(false),
        onError: (e) => setMessage(e.message), // 서버 메시지(409 등)를 그대로 보여준다
      }
    );
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

        {message && (
          <p role="alert" className="mt-2 text-sm text-red">
            {message}
          </p>
        )}

        <ul className="w-full border border-border dark:border-border-dark rounded-md max-h-60 overflow-auto mt-2">
          {results.map((coin: CoinSymbol) => (
            <li
              key={coin.symbol}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer border-b  border-border dark:border-border-dark hover:bg-hover hover:dark:bg-hover-dark ${
                isAdded(coin.id) ? "text-muted dark:text-muted-dark" : ""
              }`}
              onClick={() => handleSelectCoin(coin)}
            >
              {coin.symbol.toUpperCase()}
              {isAdded(coin.id) && <span className="text-xs">등록됨</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddModal;
