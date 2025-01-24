"use client";
import { useEffect, useState } from "react";
import { CirclePlus, CircleX } from "lucide-react";
import AddModal from "./AddModal";
import DeleteModal from "./DeleteModal";
import { useSearchData } from "@/store/store";

const AddCoinBox = () => {
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { fetchCoins } = useSearchData();

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div className="w-auto h-full flex justify-center items-center gap-5">
      <button
        onClick={() => setAddModal(true)}
        className="flex gap-2 w-auto h-full items-center rounded-full border border-green px-2"
      >
        <CirclePlus className="text-green" />
        <span className="whitespace-nowrap">코인 등록</span>
      </button>
      <button
        onClick={() => setDeleteModal(true)}
        className="flex gap-2 w-auto h-full items-center rounded-full border border-red px-2"
      >
        <CircleX className="text-red" />
        <span className="whitespace-nowrap">코인 삭제</span>
      </button>

      {addModal && <AddModal setIsModal={setAddModal} />}
      {deleteModal && <DeleteModal setIsDeleteModal={setDeleteModal} />}
    </div>
  );
};

export default AddCoinBox;
