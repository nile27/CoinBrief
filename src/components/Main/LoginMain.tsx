import Image from "next/image";
import React from "react";
import Link from "next/link";
import BtnStyle from "../CustomUI/BtnStyle";

const LoginMain = () => {
  return (
    <section className="w-full h-full px-10 flex justify-center items-center ">
      <div className=" w-full h-full flex justify-end items-center ">
        <div className=" relative min-w-[576px] max-w-[720px] max-h-[605px] min-h-[474px]  dark:border-border-dark border-border rounded-[15px] border-[10px] ">
          <Image
            src="/MainImg.svg"
            alt="main-img"
            fill
            className="rounded-[8px]"
          />
        </div>
      </div>
      <div className=" w-full h-full flex flex-col justify-center items-center">
        <div className="w-auto h-auto min-w-[300px] flex flex-col justify-center items-center  ">
          <h1 className=" w-full h-[90px] text-start text-[70px] dark:text-text-dark text-text font-extrabold p-0">
            CoinBrief
          </h1>
          <p className="  dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]  ">
            The new social experience for you and your friends. <br /> Sign up
            to learn more.
          </p>
          <Link href={"/login"} className="w-full h-auto mt-20">
            <BtnStyle width="full" height="[50px]">
              LOGIN
            </BtnStyle>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginMain;
