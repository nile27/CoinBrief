"use client";
import React, { useState } from "react";
import InputStyle from "@/components/CustomUI/InputStyle";

interface IProps {
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setVerify: React.Dispatch<React.SetStateAction<boolean>>;
  setVerifyMessage: React.Dispatch<React.SetStateAction<string>>;
  verify: boolean;
  email: string;
  name: string;
}

const PwFindInput = ({
  email,
  name,
  setVerify,
  verify,
  setVerifyMessage,
}: IProps) => {
  const [otp, setOtp] = useState("");

  const verifyOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/pwfind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, name }),
      });

      if (response.ok) {
        setVerify(true);
        setVerifyMessage("OTP 인증 성공!");
      } else {
        const errorData = await response.json();
        setVerifyMessage(errorData.message);
      }
    } catch (error) {
      console.error("OTP 검증 에러:", error);
      setVerifyMessage("OTP 검증 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className=" w-full h-auto flex justify-center items-center gap-2">
      <label htmlFor="formEmail" className="hidden"></label>
      <InputStyle
        disabled={verify}
        placeholder="인증 번호"
        autoComplete="off"
        onChange={(e) => setOtp(e.target.value)}
      />
      <button
        onClick={verifyOtp}
        disabled={verify}
        className={` bg-btn dark:bg-btn-dark  hover:bg-hover dark:hover:bg-hover-dark disabled:bg-container-dark dark:disabled:bg-container-dark
         min-w-[80px] text-[14px] h-[40px]  text-text-dark dark:text-text-dark font-semibold rounded-[10px]`}
      >
        인증
      </button>
    </div>
  );
};

export default PwFindInput;
