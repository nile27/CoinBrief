import { useState } from "react";
import { useSingleFlight } from "@/hooks/useSingleFlight";
import { useCountdown } from "@/hooks/useCountdown";
import SignUPOTP from "./SignUPOTP";

const OTP_COOLDOWN_SEC = 60; // 서버의 이메일당 60초 쿨다운과 동일

const OTPDiv = ({
  name,
  email,
  setVerify,
  verify,
}: {
  name: string;
  email: string;
  setVerify: React.Dispatch<React.SetStateAction<boolean>>;
  verify: boolean;
}) => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [sent, setSent] = useState(false);
  const { remaining, start } = useCountdown();

  const sendOtp = async () => {
    setIsModal(true);
    try {
      const response = await fetch("/api/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        setSent(true);
        start(OTP_COOLDOWN_SEC);
        alert("이메일을 보냈습니다. 이메일을 확인해주세요.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.message ?? "OTP 전송에 실패했습니다.";
        // 429 는 서버 안내(쿨다운/횟수 제한)를 그대로 보여준다
        alert(response.status === 429 ? msg : msg + " 이메일을 잘 입력했는지 확인해주세요.");
      }
    } catch (error) {
      console.error("OTP 전송 에러:", error);
      alert("OTP 전송 중 문제가 발생했습니다.");
    }
  };

  const { run: runSend, pending } = useSingleFlight(sendOtp);

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    runSend();
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return (
    <>
      <button
        onClick={handleModal}
        disabled={!email || !emailRegex.test(email) || pending || remaining > 0 || verify}
        className={` bg-btn dark:bg-btn-dark  hover:bg-btn-hover dark:hover:bg-btn-hover-dark disabled:bg-secondary disabled:text-muted dark:disabled:bg-secondary-dark dark:disabled:text-muted-dark
         min-w-[80px] h-[40px] text-[14px] text-btn-ink dark:text-btn-ink-dark font-semibold rounded-md`}
      >
        {pending ? "전송 중..." : remaining > 0 ? `재발송 (${remaining}초)` : "메일 보내기"}
      </button>
      {sent && !isModal && !verify && (
        <button type="button" onClick={() => setIsModal(true)} className="text-sm underline underline-offset-4 text-muted dark:text-muted-dark whitespace-nowrap">
          인증 번호 입력
        </button>
      )}

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
