"use client";

interface IProps {
  email: string;
  name: string;
  isInput: boolean;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setVerifyMessage: React.Dispatch<React.SetStateAction<string>>;
}

const PwFindOtp = ({
  email,
  name,
  setVerifyMessage,
  isInput,
  setIsInput,
}: IProps) => {
  const sendOtp = async () => {
    try {
      const response = await fetch("/api/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setVerifyMessage("이메일을 보냈습니다. 이메일을 확인해주세요.");
      } else {
        const errorData = await response.json();
        setVerifyMessage(
          errorData.message + " 이메일을 잘 입력했는지 확인해주세요."
        );
      }
    } catch (error) {
      console.error("OTP 전송 에러:", error);
      setVerifyMessage("OTP 전송 중 문제가 발생했습니다.");
    }
  };

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsInput(!isInput);
    sendOtp();
  };
  return (
    <>
      <button
        onClick={handleModal}
        disabled={!email || !name}
        className={` bg-btn dark:bg-btn-dark  hover:bg-hover dark:hover:bg-hover-dark disabled:bg-container-dark dark:disabled:bg-container-dark
         min-w-[80px] text-[14px] h-[40px]  text-text-dark dark:text-text-dark font-semibold rounded-[10px]`}
      >
        메일 보내기
      </button>
    </>
  );
};

export default PwFindOtp;
