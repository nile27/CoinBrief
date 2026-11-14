import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import OTPDiv from "./OTPBtn";
import { errorMessages, passwordRegex } from "@/utils/utils";

import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSingleFlight } from "@/hooks/useSingleFlight";

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
  const navi = useNavigate();

  const submitRegister = async (data: FormData) => {
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
      navi("/signend");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert("회원가입 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const { run: onSubmit, pending } = useSingleFlight(submitRegister);

  return (
    <section className="flex w-full flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-[10px] border border-border bg-container px-8 py-8 dark:border-border-dark dark:bg-container-dark mobile:px-5">
        <h1 className={`w-full font-serif text-[28px] font-semibold text-ink dark:text-ink-dark`}>
          회원 가입
        </h1>
        <div className=" flex w-full flex-wrap items-center gap-x-3">
          <p className=" text-sm text-muted dark:text-muted-dark">
            CoinBrief의 회원이신가요?
          </p>
          <Link
            to={"/login"}
            className=" text-sm text-ink dark:text-ink-dark underline underline-offset-4 decoration-border dark:decoration-border-dark hover:decoration-ink"
          >
            로그인
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full h-auto  border-border dark:border-border-dark pb-6"
        >
          <div className="w-full h-auto flex flex-col gap-4 pb-2">
            <label htmlFor="formName" className="hidden"></label>
            <InputStyle
              placeholder="이름"
              autoComplete="new-username"
              {...register("name", { required: errorMessages.nameRequired })}
            />

            <div className=" w-full h-auto flex justify-center items-center gap-2">
              <label htmlFor="formEmail" className="hidden"></label>
              <InputStyle
                placeholder="이메일"
                disabled={verify}
                autoComplete="new-email"
                {...register("email", {
                  required: errorMessages.emailRequired,
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: errorMessages.invalidEmail,
                  },
                })}
              />

              <OTPDiv
                name={watch("name")}
                email={watch("email")}
                setVerify={setVetify}
                verify={verify}
              />
            </div>

            <label htmlFor="formNickName" className="hidden"></label>
            <InputStyle
              placeholder="닉네임"
              autoComplete="new-displayName"
              {...register("displayName", {
                required: errorMessages.nicknameRequired,
              })}
            />

            <label htmlFor="formPassword" className="hidden"></label>
            <InputStyle
              type="password"
              autoComplete="new-password"
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
              autoComplete="new-confirmPassword"
              {...register("confirmPassword", {
                required: errorMessages.passwordRequired,
                validate: (value) =>
                  value === watch("password") || errorMessages.passwordMismatch,
              })}
            />

            {!verify && Object.keys(errors).length > 0 && isSubmit && (
              <p className="text-red text-sm">
                {errorMessages.verifyRequired}
              </p>
            )}

            {Object.keys(errors).length > 0 && verify && isSubmit && (
              <p className="text-red text-sm">
                {errors.name?.message ||
                  errors.email?.message ||
                  errors.displayName?.message ||
                  errors.password?.message ||
                  errors.confirmPassword?.message}
              </p>
            )}
          </div>

          <BtnStyle size="medium" disabled={pending} onClick={() => setIsSubmit(true)}>
            SIGN UP
          </BtnStyle>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
