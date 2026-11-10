"use client";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import Link from "next/link";
import PwFindOtp from "./components/PwFindOtp";
import PwFindInput from "./components/PwFindInput";
import { encodeBase64 } from "@/utill/utill";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
}

const PwFind = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: "onSubmit", reValidateMode: "onSubmit" });
  const [verify, setVerify] = useState(false);
  const [isInput, setIsInput] = useState<boolean>(false);

  const [verifyMessage, setVerifyMessage] = useState("");
  const navi = useRouter();

  const handleOnclick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!verify) {
      setVerifyMessage("본인 인증을 진행해주세요.");
      return;
    } else {
      const encodeEmail = encodeBase64(watch("email"));
      navi.push(`/pwchange?email=${encodeEmail} `);
    }
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
            href={"/signup"}
            className=" text-sm text-ink dark:text-ink-dark underline underline-offset-4 decoration-border dark:decoration-border-dark hover:decoration-ink"
          >
            회원가입
          </Link>
        </div>
        <form className="flex flex-col gap-3 w-full h-auto  border-border dark:border-border-dark pb-3">
          <div className="w-full h-auto flex flex-col gap-4 ">
            <label htmlFor="formName" className="hidden"></label>
            <InputStyle
              autoComplete="username"
              placeholder="이름"
              disabled={verify}
              {...register("name", { required: "이름을 입력해주세요." })}
            />
            <div className=" w-full h-auto flex justify-center items-center  gap-2">
              <label htmlFor="formEmail" className="hidden"></label>
              <InputStyle
                autoComplete="email"
                placeholder="이메일"
                disabled={verify}
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
                isInput={isInput}
                verify={verify}
                setIsInput={setIsInput}
                setVerifyMessage={setVerifyMessage}
              />
            </div>

            {isInput && watch("name") && (
              <PwFindInput
                email={watch("email")}
                name={watch("name")}
                setIsInput={setIsInput}
                setVerify={setVerify}
                verify={verify}
                setVerifyMessage={setVerifyMessage}
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

          <BtnStyle size="medium" onClick={handleOnclick}>
            확인
          </BtnStyle>
        </form>
      </div>
    </section>
  );
};

export default PwFind;
