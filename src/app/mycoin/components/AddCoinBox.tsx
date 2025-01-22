"use client";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import AddModal from "./AddModal";

const AddCoin = () => {
  const [isModal, setIsModal] = useState(false);
  return (
    <div className=" w-auto h-full flex justify-center items-center  gap-5">
      <button
        onClick={() => setIsModal(true)}
        className=" flex gap-2 w-auto h-full items-center  rounded-full border border-green px-2"
      >
        <CirclePlus className=" text-green " />
        <span className=" whitespace-nowrap">코인 등록</span>
      </button>

      {isModal && <AddModal setIsModal={setIsModal} />}
    </div>
  );
};

export default AddCoin;
