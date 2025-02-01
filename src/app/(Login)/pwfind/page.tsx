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
    <section className=" h-full w-auto  flex  justify-center items-center">
      <div className="w-auto h-auto gap-3 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
        <h1 className={`w-full h-full  text-header font-extrabold text-start`}>
          비밀번호 찾기
        </h1>
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <p className=" dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            CoinBrief의 회원이 아니신가요?
          </p>
          <Link
            href={"/signup"}
            className=" text-primary dark:text-primary-dark underline"
          >
            회원가입
          </Link>
        </div>
        <form className="flex flex-col gap-3 w-full h-auto  border-[rgba(113,113,113,0.8)] dark:border-[rgba(228,228,235,0.8)] pb-3">
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
              <p className="text-green text-sm mt-3">{verifyMessage}</p>
            ) : (
              <p className="text-red-500 text-sm mt-3 ">
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
