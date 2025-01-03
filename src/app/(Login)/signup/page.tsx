import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import Link from "next/link";

const SignUp = () => {
  return (
    <div>
      <section className=" h-full w-auto flex  justify-center items-center">
        <div className="w-auto h-auto gap-3 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
          <h1 className="w-full h-full text-header font-extrabold text-start">
            로그인
          </h1>
          <div className=" w-full h-auto flex justify-start items-center gap-5">
            <p className=" dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
              CoinBrief의 회원이 아니신가요?
            </p>
            <Link
              href={"/"}
              className=" text-primary dark:text-primary-dark underline"
            >
              회원가입
            </Link>
          </div>
          <form className="flex flex-col gap-5 w-full h-auto border-b-[1px] border-[rgba(113,113,113,0.8)] dark:border-[rgba(228,228,235,0.8)] pb-6">
            <div className="flex flex-col gap-5 w-full pb-5">
              <InputStyle placeholder="이메일" />
              <InputStyle placeholder="비밀번호" />
            </div>
            <BtnStyle width="full" height="[40px]">
              LOGIN
            </BtnStyle>
          </form>
          <div className=" w-full h-auto mt-1 flex gap-2 justify-center items-center"></div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
