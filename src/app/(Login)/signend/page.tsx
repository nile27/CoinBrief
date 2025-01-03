import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import Link from "next/link";

const SignEnd = () => {
  return (
    <section className=" h-full w-auto  flex  justify-center items-center">
      <div className="w-auto h-auto gap-10 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
        <h1 className={`w-full h-full text-[24px] font-extrabold text-start`}>
          CoinBrief에 가입해주셔서 감사합니다.
        </h1>

        <BtnStyle size="medium">로그인하러 가기</BtnStyle>
      </div>
    </section>
  );
};

export default SignEnd;
