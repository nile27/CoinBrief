"use client";
import React, { useEffect, useState } from "react";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";

const SignUPOTP = ({
  setIsModal,
  email,
  setVerify,
  verify,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVerify: React.Dispatch<React.SetStateAction<boolean>>;
  verify: boolean;
  email: string;
}) => {
  const [otp, setOtp] = useState("");
  const [verifyMessage, setVerifyMessage] = useState<string>("");

  const verifyOtp = async () => {
    try {
      const response = await fetch("/api/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setVerify(true);
        alert("OTP 인증 성공!");
        setIsModal(false);
      } else {
        const errorData = await response.json();
        setVerifyMessage(errorData.message);
      }
    } catch (error) {
      console.error("OTP 검증 에러:", error);
      setVerifyMessage("OTP 검증 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    console.log(email, "email:");
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
            <InputStyle
              placeholder="인증 번호"
              onChange={(e) => setOtp(e.target.value)}
            />
            <BtnStyle size="small" onClick={verifyOtp}>
              인증
            </BtnStyle>
          </div>
          <p className={`text-red text-left w-full h-auto px-2 mb-3  `}>
            {verifyMessage}
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
