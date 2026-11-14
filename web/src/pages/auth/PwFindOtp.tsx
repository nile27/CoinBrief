import { useSingleFlight } from "@/hooks/useSingleFlight";
import { useCountdown } from "@/hooks/useCountdown";

const OTP_COOLDOWN_SEC = 60; // 서버의 이메일당 60초 쿨다운과 동일

interface IProps {
  email: string;
  name: string;
  canSend: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setVerifyMessage: React.Dispatch<React.SetStateAction<string>>;
}

const PwFindOtp = ({
  email,
  name,
  setVerifyMessage,
  canSend,
  setLocked,
  setOtp,
  setIsInput,
}: IProps) => {
  const { remaining, start } = useCountdown();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const sendOtp = async () => {
    try {
      const response = await fetch("/api/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, purpose: "pwfind" }),
      });

      if (response.ok) {
        setIsInput(true);
        setLocked(false);
        setOtp("");
        setVerifyMessage("");
        start(OTP_COOLDOWN_SEC);
        alert("이메일을 보냈습니다. 이메일을 확인해주세요.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.message ?? "OTP 전송에 실패했습니다.";
        // 429 는 서버 안내(쿨다운/횟수 제한)를 그대로 보여준다
        setVerifyMessage(response.status === 429 ? msg : msg + " 입력한 이메일을 확인해주세요.");
      }
    } catch (error) {
      console.error("OTP 전송 에러:", error);
      setVerifyMessage("OTP 전송 중 문제가 발생했습니다.");
    }
  };

  const { run, pending } = useSingleFlight(sendOtp);

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    run();
  };
  return (
    <>
      <button
        type="button"
        onClick={handleModal}
        disabled={!email || !name || !emailRegex.test(email) || !canSend || pending || remaining > 0}
        className={` bg-btn dark:bg-btn-dark  hover:bg-btn-hover dark:hover:bg-btn-hover-dark disabled:bg-secondary disabled:text-muted dark:disabled:bg-secondary-dark dark:disabled:text-muted-dark
         min-w-[80px] text-[14px] h-[40px]  text-btn-ink dark:text-btn-ink-dark font-semibold rounded-md`}
      >
        {pending ? "전송 중..." : remaining > 0 ? `재발송 (${remaining}초)` : "메일 보내기"}
      </button>
    </>
  );
};

export default PwFindOtp;
