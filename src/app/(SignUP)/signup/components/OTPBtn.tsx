"use client";
import { useState } from "react";
import SignUPOTP from "./SignUPOTP";

const OTPDiv = ({
  email,
  setVerify,
  verify,
}: {
  email: string;
  setVerify: React.Dispatch<React.SetStateAction<boolean>>;
  verify: boolean;
}) => {
  const [isModal, setIsModal] = useState<boolean>(false);

  const sendOtp = async () => {
    try {
      const response = await fetch("/api/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("이메일을 보냈습니다. 이메일을 확인해주세요.");
      } else {
        const errorData = await response.json();
        alert(errorData.message + " 이메일을 잘 입력했는지 확인해주세요.");
      }
    } catch (error) {
      console.error("OTP 전송 에러:", error);
      alert("OTP 전송 중 문제가 발생했습니다.");
    }
  };

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsModal(!isModal);
    sendOtp();
    console.log(isModal);
  };
  return (
    <>
      <button
        onClick={handleModal}
        disabled={!email}
        className={` bg-btn dark:bg-btn-dark  hover:bg-hover dark:hover:bg-hover-dark disabled:bg-container-dark dark:disabled:bg-container-dark
         min-w-[80px] h-[40px] text-[14px] text-text-dark dark:text-text-dark font-semibold rounded-[10px]`}
      >
        메일 보내기
      </button>

      {isModal && (
        <SignUPOTP
          email={email}
          setIsModal={setIsModal}
          setVerify={setVerify}
          verify={verify}
        />
      )}
    </>
  );
};

export default OTPDiv;
