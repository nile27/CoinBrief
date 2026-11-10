import { useState } from "react";
import { Link } from "react-router";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import Google from "@/../public/Google.svg?react";
import Kakao from "@/../public/KakaoTalk.svg?react";
import { errorMessages } from "./loginMessages";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { finishLogin } from "@/lib/session";
import { googleLogin, kakaoLogin } from "./AuthLogin";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onSubmit", reValidateMode: "onSubmit" });
  const navi = useNavigate();
  const qc = useQueryClient();
  const [errMessage, setErrMessage] = useState<string>("");

  const testUser = {
    email: import.meta.env.VITE_TEST_EMAIL,
    password: import.meta.env.VITE_TEST_PW,
  };

  const handleTestLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("테스트 계정 로그인 실패");
      }

      const data = await response.json();
      const user = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        displayName: data.data.nickname,
        mycoin: data.data.mycoin,
      };

      finishLogin(qc, user);
      navi("/mycoin");
    } catch (error) {
      console.error("테스트 계정 로그인 실패:", error);
      setErrMessage("테스트 계정 로그인 실패");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userData = await googleLogin();
      if (userData) {
        finishLogin(qc, userData);
        navi("/mycoin");
      }
    } catch (error) {
      setErrMessage("잘못된 접근입니다.");
    }
  };

  const onSubmit = async (data: FormData) => {
    const jsonData = JSON.stringify(data);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "로그인에 실패했습니다.");
      }
      finishLogin(qc, {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        displayName: data.data.nickname,
        mycoin: data.data.mycoin,
      });
      navi("/mycoin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setErrMessage(`이메일, 비밀번호가 일치하지 않습니다.`);
      } else {
        setErrMessage("로그인 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <section className="flex w-full flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-[10px] border border-border bg-container px-8 py-8 dark:border-border-dark dark:bg-container-dark mobile:px-5">
        <div className="w-full flex items-center justify-between gap-3">
          <h1 className="w-full font-serif text-[28px] font-semibold text-ink dark:text-ink-dark">
            로그인
          </h1>
          <BtnStyle onClick={handleTestLogin} size="auto">
            테스트 계정 로그인
          </BtnStyle>
        </div>

        <div className=" flex w-full flex-wrap items-center gap-x-3">
          <p className=" text-sm text-muted dark:text-muted-dark">
            비밀번호를 잊어버리셨나요?
          </p>
          <Link
            to={"/pwfind"}
            className=" text-sm text-ink dark:text-ink-dark underline underline-offset-4 decoration-border dark:decoration-border-dark hover:decoration-ink"
          >
            비밀번호 찾기
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full h-auto border-b-[1px] border-border dark:border-border-dark pb-6"
        >
          <div className="flex flex-col gap-5 w-full ">
            <label htmlFor="formEmail" className="hidden"></label>
            <InputStyle
              autoComplete="current-password"
              placeholder="이메일"
              {...register("email", {
                required: errorMessages.emailRequired,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: errorMessages.invalidEmail,
                },
              })}
            />
            <label htmlFor="formPassword" className="hidden"></label>
            <InputStyle
              type="password"
              placeholder="비밀번호 "
              autoComplete="current-password"
              {...register("password", {
                required: errorMessages.passwordMismatch,
                minLength: {
                  value: 8,
                  message: errorMessages.passwordTooShort,
                },
              })}
            />
          </div>
          {Object.keys(errors).length > 0 && (
            <p className="text-red text-sm">
              {errors.email?.message || errors.password?.message}
            </p>
          )}
          {errMessage && Object.keys(errors).length === 0 && (
            <p className="text-red text-sm">{errMessage}</p>
          )}
          <BtnStyle size="medium">LOGIN</BtnStyle>
        </form>

        <div className=" w-full h-auto mt-1 flex gap-2 justify-center items-center">
          <button
            onClick={handleGoogleLogin}
            className="h-10 w-full gap-2 rounded-md border border-border text-sm flex justify-center items-center transition-colors hover:bg-hover dark:border-border-dark dark:hover:bg-hover-dark"
          >
            <Google />
            Google
          </button>
          <button
            onClick={kakaoLogin}
            className="h-10 w-full gap-2 rounded-md border border-border text-sm flex justify-center items-center transition-colors hover:bg-hover dark:border-border-dark dark:hover:bg-hover-dark"
          >
            <Kakao />
            Kakao
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
