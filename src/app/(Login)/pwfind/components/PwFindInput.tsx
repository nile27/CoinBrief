"use client";
import React from "react";
import InputStyle from "@/components/CustomUI/InputStyle";

interface IProps {
  verify: boolean;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  onVerify: () => void;
}

const PwFindInput = ({ verify, otp, setOtp, onVerify }: IProps) => {
  return (
    <div className=" w-full h-auto flex justify-center items-center gap-2">
      <InputStyle
        disabled={verify}
        placeholder="인증 번호"
        autoComplete="off"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onVerify();
          }
        }}
      />
      <button
        type="button"
        onClick={onVerify}
        disabled={verify}
        className={` bg-btn dark:bg-btn-dark  hover:bg-btn-hover dark:hover:bg-btn-hover-dark disabled:bg-secondary disabled:text-muted dark:disabled:bg-secondary-dark dark:disabled:text-muted-dark
         min-w-[80px] text-[14px] h-[40px]  text-btn-ink dark:text-btn-ink-dark font-semibold rounded-md`}
      >
        인증
      </button>
    </div>
  );
};

export default PwFindInput;
