"use client";
import React, { useEffect } from "react";
import { CircleX } from "lucide-react";
import { useCoinStore, useUserStore } from "@/store/store";

const DeleteModal = ({
  setIsDeleteModal,
}: {
  setIsDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, deleteCoin } = useUserStore();
  const { setSelectedCoin, removeStaticData } = useCoinStore();

  const handleDeleteCoin = async (symbol: string, idx: number) => {
    await deleteCoin(idx);

    removeStaticData(symbol);
    setSelectedCoin(0);
  };

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
        className="bg-background dark:bg-background-dark w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsDeleteModal(false)}
          className="absolute top-4 right-4"
        >
          <CircleX className="text-gray-500 hover:text-red-500" />
        </button>
        <h2 className="text-lg font-bold mb-4">내 코인 삭제</h2>
        <ul className="w-full border rounded-lg max-h-60 overflow-hidden overflow-y-auto bg-background dark:bg-background-dark">
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
                className="text-gray-500 hover:text-red-500"
              >
                <CircleX />
              </button>
            </li>
          ))}
          {user.mycoin.length === 0 && (
            <li className="px-4 py-2 text-gray-500">등록된 코인이 없습니다.</li>
          )}
        </ul>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsDeleteModal(false)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-md "
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
