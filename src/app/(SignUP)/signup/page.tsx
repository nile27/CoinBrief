"use client";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import Link from "next/link";

import { useState } from "react";
import SignUPOTP from "./components/SignUPOTP";

const SignUp = () => {
  const [isModal, setIsModal] = useState<boolean>(false);

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsModal(!isModal);
    console.log(isModal);
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
        <form className="flex flex-col gap-5 w-full h-auto  border-[rgba(113,113,113,0.8)] dark:border-[rgba(228,228,235,0.8)] pb-6">
          <div className="w-full h-auto flex flex-col gap-4 pb-2">
            <label htmlFor="formName" className="hidden"></label>
            <InputStyle placeholder="이름" />
            <div className=" w-full h-auto flex justify-center items-center gap-2">
              <label htmlFor="formEmail" className="hidden"></label>
              <InputStyle placeholder="이메일" />
              <BtnStyle size="small" onClick={handleModal}>
                본인 인증
              </BtnStyle>
            </div>
            {/* <div className=" w-full h-auto flex justify-center items-center gap-2">
              <label htmlFor="formOTP" className="hidden"></label>
              <InputStyle placeholder="본인 인증" />
              <BtnStyle size="small">본인 인증</BtnStyle>
            </div> */}
            <label htmlFor="formNickName" className="hidden"></label>
            <InputStyle placeholder="닉네임" />
            <label htmlFor="formPassword" className="hidden"></label>
            <InputStyle
              type="password"
              placeholder="비밀번호 (8~20 영문 숫자, 특수문자 조합)"
            />

            <InputStyle placeholder="비밀번호 확인" />
            {true && (
              <span className=" text-[#DF4646] pb-2 ">
                비밀번호를 입력해주세요.
              </span>
            )}
          </div>

          <BtnStyle size="medium">SIGN UP</BtnStyle>
        </form>
      </div>
      {isModal && <SignUPOTP setIsModal={setIsModal} />}
    </section>
  );
};

export default SignUp;
