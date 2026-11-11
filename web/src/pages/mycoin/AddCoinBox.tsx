import { useState } from "react";
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
    fetchCoins(); // 검색 목록은 모달을 열 때 불러온다 (진입 시 Firestore 장기 연결을 열지 않기 위해)
    setAddModal(true);
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={addModalHandler} className="h-10 gap-2 px-4 rounded-md border border-border bg-container text-sm text-ink transition-colors hover:bg-hover dark:border-border-dark dark:bg-container-dark dark:text-ink-dark dark:hover:bg-hover-dark flex items-center">
        <CirclePlus size={18} className="text-muted dark:text-muted-dark" />
        <span className="whitespace-nowrap">코인 등록</span>
      </button>
      <button onClick={() => setDeleteModal(true)} className="h-10 gap-2 px-4 rounded-md border border-border bg-container text-sm text-ink transition-colors hover:bg-hover dark:border-border-dark dark:bg-container-dark dark:text-ink-dark dark:hover:bg-hover-dark flex items-center">
        <CircleX size={18} className="text-muted dark:text-muted-dark" />
        <span className="whitespace-nowrap">코인 삭제</span>
      </button>

      {addModal && <AddModal setIsModal={setAddModal} />}
      {deleteModal && <DeleteModal setIsDeleteModal={setDeleteModal} />}
    </div>
  );
};

export default AddCoinBox;
