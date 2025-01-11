"use client";
import React, { useEffect, useState } from "react";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";

interface IProps {
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setVerify: React.Dispatch<React.SetStateAction<boolean>>;
  setVerifyMessage: React.Dispatch<React.SetStateAction<string>>;

  email: string;
  name: string;
}

const PwFindInput = ({
  email,
  name,
  setVerify,

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
        placeholder="인증 번호"
        onChange={(e) => setOtp(e.target.value)}
      />
      <BtnStyle size="small" onClick={verifyOtp}>
        인증
      </BtnStyle>
    </div>
  );
};

export default PwFindInput;
