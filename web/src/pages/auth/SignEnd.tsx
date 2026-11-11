import BtnStyle from "@/components/CustomUI/BtnStyle";
import { Link } from "react-router";

const SignEnd = () => {
  return (
    <section className="flex w-full flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-[10px] border border-border bg-container px-8 py-8 dark:border-border-dark dark:bg-container-dark mobile:px-5">
        <h1 className={`w-full font-serif text-[24px] font-semibold text-ink dark:text-ink-dark`}>
          CoinBrief에 가입해주셔서 감사합니다.
        </h1>
        <Link to="/login" className="w-full h-auto">
          <BtnStyle size="medium">로그인하러 가기</BtnStyle>
        </Link>
      </div>
    </section>
  );
};

export default SignEnd;
