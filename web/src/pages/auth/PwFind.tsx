import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import { Link } from "react-router";
import PwFindOtp from "./PwFindOtp";
import PwFindInput from "./PwFindInput";
import { encodeBase64 } from "@/utils/utils";

import { useState } from "react";
import { useSingleFlight } from "@/hooks/useSingleFlight";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
}

const PwFind = () => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: "onSubmit", reValidateMode: "onSubmit" });
  const [verify, setVerify] = useState(false);
  const [isInput, setIsInput] = useState<boolean>(false);

  const [locked, setLocked] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const navi = useNavigate();

  const doVerify = async () => {
    try {
      const response = await fetch("/api/pwfind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: watch("email"),
          name: watch("name"),
          otp: otp.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setVerify(true);
        setVerifyMessage("OTP 인증 성공!");
      } else {
        setVerifyMessage(data.message || "OTP 검증 중 문제가 발생했습니다.");
        if (response.status === 429) {
          // 서버가 OTP를 삭제함: 입력 비우고 메일 다시 보내기 허용
          setOtp("");
          setLocked(true);
        }
      }
    } catch (error) {
      console.error("OTP 검증 에러:", error);
      setVerifyMessage("OTP 검증 중 문제가 발생했습니다.");
    }
  };

  const { run: verifyOtp, pending: verifying } = useSingleFlight(doVerify);

  const handleReset = () => {
    reset();
    setVerify(false);
    setIsInput(false);
    setLocked(false);
    setOtp("");
    setVerifyMessage("");
  };

  return (
    <section className="flex w-full flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-[10px] border border-border bg-container px-8 py-8 dark:border-border-dark dark:bg-container-dark mobile:px-5">
        <h1 className={`w-full font-serif text-[28px] font-semibold text-ink dark:text-ink-dark`}>
          비밀번호 찾기
        </h1>
        <div className=" flex w-full flex-wrap items-center gap-x-3">
          <p className=" text-sm text-muted dark:text-muted-dark">
            CoinBrief의 회원이 아니신가요?
          </p>
          <Link
            to={"/signup"}
            className=" text-sm text-ink dark:text-ink-dark underline underline-offset-4 decoration-border dark:decoration-border-dark hover:decoration-ink"
          >
            회원가입
          </Link>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 w-full h-auto  border-border dark:border-border-dark pb-3">
          <div className="w-full h-auto flex flex-col gap-4 ">
            <label htmlFor="formName" className="hidden"></label>
            <InputStyle
              autoComplete="username"
              placeholder="이름"
              disabled={isInput}
              {...register("name", { required: "이름을 입력해주세요." })}
            />
            <div className=" w-full h-auto flex justify-center items-center  gap-2">
              <label htmlFor="formEmail" className="hidden"></label>
              <InputStyle
                autoComplete="email"
                placeholder="이메일"
                disabled={isInput}
                {...register("email", {
                  required: "이메일을 입력해주세요",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "이메일을 확인해주세요.",
                  },
                })}
              />
              <PwFindOtp
                email={watch("email")}
                name={watch("name")}
                canSend={!verify && (!isInput || locked)}
                setLocked={setLocked}
                setOtp={setOtp}
                setIsInput={setIsInput}
                setVerifyMessage={setVerifyMessage}
              />
            </div>

            {isInput && watch("name") && (
              <PwFindInput
                verify={verify}
                pending={verifying}
                otp={otp}
                setOtp={setOtp}
                onVerify={verifyOtp}
              />
            )}

            {verify && Object.keys(errors).length <= 0 ? (
              <p className="text-green text-sm">{verifyMessage}</p>
            ) : (
              <p className="text-red text-sm ">
                {errors.email?.message || errors.name?.message || verifyMessage}
              </p>
            )}
          </div>

          {isInput && (
            <button
              type="button"
              onClick={handleReset}
              className="self-start text-sm text-muted underline underline-offset-4 dark:text-muted-dark"
            >
              다시 입력
            </button>
          )}
          <BtnStyle
            size="medium"
            type="button"
            disabled={!verify}
            onClick={() =>
              navi(`/pwchange?email=${encodeBase64(watch("email"))}`)
            }
          >
            확인
          </BtnStyle>
        </form>
      </div>
    </section>
  );
};

export default PwFind;
