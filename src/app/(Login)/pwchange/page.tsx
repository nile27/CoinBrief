"use client";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";

import { decodeBase64, errorMessages, passwordRegex } from "@/utill/utill";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface FormData {
  password: string;
  confirmPassword: string;
}

const PwChange = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: "onSubmit", reValidateMode: "onSubmit" });
  const searchParams = useSearchParams();
  const encodedEmail = searchParams.get("email");
  const email = encodedEmail ? decodeBase64(encodedEmail) : null;
  const [errMessages, setErrMessages] = useState("");
  const navi = useRouter();

  const onSubmit = async (data: FormData) => {
    const password = data.password || "";

    try {
      const response = await fetch("/api/pwchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navi.push("/login");
      } else {
        const errorData = await response.json();
        setErrMessages(errorData.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      setErrMessages("비밀번호 변경에 문제가 발생했습니다.");
    }
  };

  return (
    <section className=" h-full w-auto  flex  justify-center items-center">
      <div className="w-auto h-auto gap-3 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
        <h1
          className={` h-full  text-header font-extrabold text-start w-[388px]`}
        >
          비밀번호 변경
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full h-auto  border-[rgba(113,113,113,0.8)] dark:border-[rgba(228,228,235,0.8)] pb-6"
        >
          <div className="w-full h-auto flex flex-col gap-4 pb-2">
            <label htmlFor="formPassword" className="hidden"></label>
            <InputStyle
              type="password"
              autoComplete="current-password"
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
              autoComplete="current-confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: errorMessages.passwordRequired,
                validate: (value) =>
                  value === watch("password") || errorMessages.passwordMismatch,
              })}
            />

            {Object.keys(errors).length > 0 ||
              (errMessages && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password?.message ||
                    errors.confirmPassword?.message ||
                    errMessages}
                </p>
              ))}
          </div>

          <BtnStyle size="medium">SIGN UP</BtnStyle>
        </form>
      </div>
    </section>
  );
};

export default PwChange;
