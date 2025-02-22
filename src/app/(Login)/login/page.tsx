"use client";
import { useState } from "react";
import Link from "next/link";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import Google from "@/../public/Google.svg";
import Kakao from "@/../public/KakaoTalk.svg";
import { errorMessages } from "./utill/utill";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore } from "@/store/store";
import { googleLogin, kakaoLogin } from "./utill/AuthLogin";

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
  const navi = useRouter();
  const { login } = useAuthStore();
  const { setUser } = useUserStore();
  const [errMessage, setErrMessage] = useState<string>("");

  const testUser = {
    email: process.env.NEXT_PUBLIC_TEST_EMAIL,
    password: process.env.NEXT_PUBLIC_TEST_PW,
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

      login();
      setUser(user);
      window.location.href = "/mycoin";
    } catch (error) {
      console.error("테스트 계정 로그인 실패:", error);
      setErrMessage("테스트 계정 로그인 실패");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userData = await googleLogin();
      if (userData) {
        setUser(userData);
        login();
        window.location.href = "/mycoin";
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
      const user = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        displayName: data.data.nickname,
        mycoin: data.data.mycoin,
      };

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "로그인에 실패했습니다.");
      }
      login();
      setUser(user);
      navi.push("/mycoin");
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
    <section className=" h-full w-auto flex  justify-center items-center">
      <div className="w-auto h-auto gap-3 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="w-full h-full text-header font-extrabold text-start">
            로그인
          </h1>
          <BtnStyle onClick={handleTestLogin} size="auto">
            테스트 계정 로그인
          </BtnStyle>
        </div>

        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <p className=" dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            비밀번호를 잊어버리셨나요?
          </p>
          <Link
            href={"/pwfind"}
            className=" text-primary dark:text-primary-dark underline"
          >
            비밀번호 찾기
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full h-auto border-b-[1px] border-[rgba(113,113,113,0.8)] dark:border-[rgba(228,228,235,0.8)] pb-6"
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
            <p className="text-red-500 text-sm mt-2">
              {errors.email?.message || errors.password?.message}
            </p>
          )}
          {errMessage && Object.keys(errors).length === 0 && (
            <p className="text-red-500 text-sm mt-2">{errMessage}</p>
          )}
          <BtnStyle size="medium">LOGIN</BtnStyle>
        </form>

        <div className=" w-full h-auto mt-1 flex gap-2 justify-center items-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full h-[30px] gap-3 bg-container dark:bg-container-dark rounded-md flex justify-center items-center "
          >
            <Google />
            Google
          </button>
          <button
            onClick={kakaoLogin}
            className="w-full h-[30px] gap-3 bg-container dark:bg-container-dark rounded-md flex justify-center items-center "
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
