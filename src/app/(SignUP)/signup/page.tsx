"use client";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import OTPDiv from "./components/OTPBtn";
import { errorMessages, passwordRegex } from "@/utill/utill";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm<FormData>({ mode: "onSubmit", reValidateMode: "onSubmit" });
  const [verify, setVetify] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const navi = useRouter();

  const onSubmit = async (data: FormData) => {
    const jsonData = JSON.stringify(data);

    if (!verify) {
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "회원가입에 실패했습니다.");
      }

      await response.json();
      navi.push("/signend");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert("회원가입 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <section className=" h-full w-auto flex justify-center items-center pt-8 pb-10">
      <div className="w-auto h-auto gap-3 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
        <h1 className={`w-full h-full  text-header font-extrabold text-start`}>
          회원 가입
        </h1>
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <p className=" dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            CoinBrief의 회원이신가요?
          </p>
          <Link
            href={"/login"}
            className=" text-primary dark:text-primary-dark underline"
          >
            로그인
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full h-auto  border-[rgba(113,113,113,0.8)] dark:border-[rgba(228,228,235,0.8)] pb-6"
        >
          <div className="w-full h-auto flex flex-col gap-4 pb-2">
            <label htmlFor="formName" className="hidden"></label>
            <InputStyle
              placeholder="이름"
              {...register("name", { required: errorMessages.nameRequired })}
            />

            <div className=" w-full h-auto flex justify-center items-center gap-2">
              <label htmlFor="formEmail" className="hidden"></label>
              <InputStyle
                placeholder="이메일"
                disabled={verify}
                {...register("email", {
                  required: errorMessages.emailRequired,
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: errorMessages.invalidEmail,
                  },
                })}
              />

              <OTPDiv
                email={watch("email")}
                setVerify={setVetify}
                verify={verify}
              />
            </div>

            <label htmlFor="formNickName" className="hidden"></label>
            <InputStyle
              placeholder="닉네임"
              {...register("displayName", {
                required: errorMessages.nicknameRequired,
              })}
            />

            <label htmlFor="formPassword" className="hidden"></label>
            <InputStyle
              type="password"
              placeholder="비밀번호 (8~20 영문 숫자, 특수문자 조합 중 2개 이상)"
              {...register("password", {
                required: errorMessages.passwordRequired,
                minLength: {
                  value: 8,
                  message: errorMessages.passwordTooShort,
                },
                pattern: {
                  value: passwordRegex,
                  message: errorMessages.passwordWrong,
                },
              })}
            />

            <InputStyle
              placeholder="비밀번호 확인"
              type="password"
              {...register("confirmPassword", {
                required: errorMessages.passwordRequired,
                validate: (value) =>
                  value === watch("password") || errorMessages.passwordMismatch,
              })}
            />

            {!verify && Object.keys(errors).length > 0 && isSubmit && (
              <p className="text-red-500 text-sm mt-2">
                {errorMessages.verifyRequired}
              </p>
            )}

            {Object.keys(errors).length > 0 && verify && isSubmit && (
              <p className="text-red-500 text-sm mt-2">
                {errors.name?.message ||
                  errors.email?.message ||
                  errors.displayName?.message ||
                  errors.password?.message ||
                  errors.confirmPassword?.message}
              </p>
            )}
          </div>

          <BtnStyle size="medium" onClick={() => setIsSubmit(true)}>
            SIGN UP
          </BtnStyle>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
