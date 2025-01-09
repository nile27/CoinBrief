"use client";
import React, { useEffect } from "react";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";

const SignUPOTP = ({
  setIsModal,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
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
          <h2 className="text-smallHeader font-bold mb-4 w-full text-center">
            본인 인증
          </h2>
          <div className="flex justify-between mb-3 gap-5">
            <InputStyle placeholder="인증 번호" />
            <BtnStyle size="small">인증</BtnStyle>
          </div>
          <p
            className={`${
              false ? "text-green" : "text-red"
            } text-left w-full h-auto px-2 mb-3  `}
          >
            {false
              ? "본인 인증에 성공하였습니다."
              : "본인 인증에 실패하였습니다. 이메일을 확인해주세요."}
          </p>
        </div>
        <button
          onClick={() => setIsModal(false)}
          className=" w-[100px]  px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SignUPOTP;
