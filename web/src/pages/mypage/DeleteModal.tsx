import { useState } from "react";
import { CircleX } from "lucide-react";
import InputStyle from "@/components/CustomUI/InputStyle";
import { apiFetch } from "@/lib/api";
import { useLogout } from "@/lib/session";

const DeleteModal = ({
  id,
  setIsModal,
}: {
  id: string;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const handleLogout = useLogout();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsButtonEnabled(value === "회원탈퇴");
  };

  const deleteHandle = async () => {
    try {
      await apiFetch(`/api/deleteuser?uid=${id}`, { method: "DELETE" });

      await handleLogout();
      alert("회원탈퇴가 완료되었습니다.");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => setIsModal(false)}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div
        className=" flex flex-col gap-3 justify-between items-center w-[90%] min-h[200px] max-w-md p-6 rounded-[10px] z-60 border border-border dark:border-border-dark bg-container dark:bg-container-dark relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-full h-auto">
          <button
            onClick={() => setIsModal(false)}
            className="absolute top-4 right-4"
          >
            <CircleX className="text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark" />
          </button>
        </div>
        <p className="text-center text-sm text-muted dark:text-muted-dark">
          아래 입력란에 <strong>회원탈퇴</strong>를 입력하세요.
        </p>
        <InputStyle
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="회원탈퇴를 입력하세요."
        />

        <button
          onClick={deleteHandle}
          disabled={!isButtonEnabled}
          className={`w-[100px] mt-4 px-4 py-2 font-bold rounded-md ${
            isButtonEnabled
              ? "bg-red text-white hover:opacity-90"
              : "bg-secondary text-muted dark:bg-secondary-dark dark:text-muted-dark cursor-not-allowed"
          }`}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
