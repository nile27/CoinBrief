import BtnStyle from "@/components/CustomUI/BtnStyle";
import Link from "next/link";

const notFound = () => {
  return (
    <section className="flex h-[75vh] w-full items-center justify-center px-4">
      <div className="flex h-auto w-full max-w-[420px] flex-col items-center gap-3 rounded-[10px] border border-border bg-container px-8 py-8 dark:border-border-dark dark:bg-container-dark">
        <h1 className="w-full text-left font-serif text-[24px] font-semibold text-ink dark:text-ink-dark">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mb-5 h-auto w-full text-left text-muted dark:text-muted-dark">
          잘못된 접근입니다.
          <br /> 서비스 이용에 불편을 드려 죄송합니다.
        </p>

        <Link href="/" className="h-auto w-full">
          <BtnStyle size="medium">홈으로 돌아가기</BtnStyle>
        </Link>
      </div>
    </section>
  );
};

export default notFound;
