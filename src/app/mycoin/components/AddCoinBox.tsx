"use client";
import { useEffect, useState } from "react";
import { CirclePlus, CircleX } from "lucide-react";
import AddModal from "./AddModal";
import DeleteModal from "./DeleteModal";
import { useSearchData, useUserStore } from "@/store/store";

const AddCoinBox = () => {
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { mycoin } = useUserStore().user;

  const { fetchCoins } = useSearchData();

  const addModalHandler = () => {
    if (mycoin.length === 4) {
      alert(
        "내 코인 개수는 최대 4개 입니다. 기존 코인을 삭제하고 등록해주세요."
      );
      return;
    }
    setAddModal(true);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div className="w-auto h-full flex justify-center items-center gap-5">
      <button
        onClick={addModalHandler}
        className=" group dark:hover:border-[#076d08] hover:border-[#58d073] hover:text-gray-400 dark:hover:text-gray-400 flex gap-2 w-auto px-4 py-2 items-center rounded-full border border-green "
      >
        <CirclePlus className="text-green  dark:group-hover:text-[#076d08] group-hover:text-[#58d073]" />
        <span className="whitespace-nowrap">코인 등록</span>
      </button>
      <button
        onClick={() => setDeleteModal(true)}
        className="  group dark:hover:border-[#ac2929] hover:border-[#ed7c7c] hover:text-gray-400 dark:hover:text-gray-400 flex gap-2 w-auto px-4 py-2 items-center rounded-full border border-red "
      >
        <CircleX className="text-red  dark:group-hover:text-[#ac2929] group-hover:text-[#ed7c7c]" />
        <span className="whitespace-nowrap">코인 삭제</span>
      </button>

      {addModal && <AddModal setIsModal={setAddModal} />}
      {deleteModal && <DeleteModal setIsDeleteModal={setDeleteModal} />}
    </div>
  );
};

export default AddCoinBox;
