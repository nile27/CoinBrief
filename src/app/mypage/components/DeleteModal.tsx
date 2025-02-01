"use client";
import { useState } from "react";
import { CircleX } from "lucide-react";
import InputStyle from "@/components/CustomUI/InputStyle";
import { useAuthStore, useUserStore } from "@/store/store";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

const DeleteModal = ({
  id,
  setIsModal,
}: {
  id: string;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const { logout } = useAuthStore();
  const { deleteUser } = useUserStore();
  const navi = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsButtonEnabled(value === "회원탈퇴");
  };

  const handleLogout = () => {
    logout();
    deleteUser();
    navi.push("/");
    signOut(auth);
  };

  const deleteHandle = async () => {
    try {
      const res = await fetch(`/api/deleteuser?uid=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "유저 삭제 실패");
      }

      handleLogout();
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
        className=" flex flex-col gap-3 justify-between items-center bg-background dark:bg-background-dark w-[90%] min-h[200px] max-w-md p-6 rounded-lg z-60 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-full h-auto">
          <button
            onClick={() => setIsModal(false)}
            className="absolute top-4 right-4"
          >
            <CircleX className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-300">
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
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
