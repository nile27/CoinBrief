"use client";
interface IProps {
  email: string;
  name: string;
  isInput: boolean;
  verify: boolean;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setVerifyMessage: React.Dispatch<React.SetStateAction<string>>;
}

const PwFindOtp = ({
  email,
  name,
  setVerifyMessage,
  verify,
  setIsInput,
}: IProps) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const sendOtp = async () => {
    try {
      const response = await fetch("/api/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        alert("이메일을 보냈습니다. 이메일을 확인해주세요.");
      } else {
        const errorData = await response.json();
        setVerifyMessage(errorData.message + " 입력한 이메일을 확인해주세요.");
      }
    } catch (error) {
      console.error("OTP 전송 에러:", error);
      setVerifyMessage("OTP 전송 중 문제가 발생했습니다.");
    }
  };

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsInput(true);
    sendOtp();
  };
  return (
    <>
      <button
        onClick={handleModal}
        disabled={!email || !name || !emailRegex.test(email) || verify}
        className={` bg-btn dark:bg-btn-dark  hover:bg-hover dark:hover:bg-hover-dark disabled:bg-container-dark dark:disabled:bg-container-dark
         min-w-[80px] text-[14px] h-[40px]  text-text-dark dark:text-text-dark font-semibold rounded-[10px]`}
      >
        메일 보내기
      </button>
    </>
  );
};

export default PwFindOtp;
