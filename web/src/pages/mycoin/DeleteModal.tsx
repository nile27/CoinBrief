import React, { useEffect } from "react";
import { CircleX } from "lucide-react";
import { useCoinStore, useUserStore } from "@/store/store";
import { useDeleteCoin } from "@/lib/mutations";

const DeleteModal = ({
  setIsDeleteModal,
}: {
  setIsDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useUserStore();
  const del = useDeleteCoin();
  const { setSelectedCoin, removeStaticData } = useCoinStore();

  const handleDeleteCoin = (symbol: string, idx: number) =>
    del.mutate(
      { coin: user.mycoin[idx], idx },
      {
        onSuccess: () => {
          removeStaticData(symbol);
          setSelectedCoin(0);
        },
      }
    );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => setIsDeleteModal(false)}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className="w-[90%] max-w-lg p-6 rounded-[10px] border border-border dark:border-border-dark bg-container dark:bg-container-dark relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsDeleteModal(false)}
          className="absolute top-4 right-4"
        >
          <CircleX className="text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark" />
        </button>
        <h2 className="font-serif text-xl font-semibold text-ink dark:text-ink-dark mb-4">내 코인 삭제</h2>
        <ul className="w-full border border-border dark:border-border-dark rounded-md max-h-60 overflow-y-auto">
          {user.mycoin.map((coin, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center px-4 py-2 bg-transparent"
            >
              <span>
                {coin.name} ({coin.symbol})
              </span>
              <button
                onClick={() => handleDeleteCoin(coin.symbol, idx)}
                className="text-muted hover:text-red dark:text-muted-dark dark:hover:text-red"
              >
                <CircleX />
              </button>
            </li>
          ))}
          {user.mycoin.length === 0 && (
            <li className="px-4 py-2 text-muted dark:text-muted-dark">등록된 코인이 없습니다.</li>
          )}
        </ul>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsDeleteModal(false)}
            className="h-10 px-4 text-sm rounded-md border border-border dark:border-border-dark hover:bg-hover dark:hover:bg-hover-dark"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
