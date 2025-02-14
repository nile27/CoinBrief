import BtnStyle from "@/components/CustomUI/BtnStyle";
import Link from "next/link";

const notFound = () => {
  return (
    <section className=" h-[75vh] w-[100vw]  flex  justify-center items-center">
      <div className="w-auto h-auto gap-2 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
        <h1
          className={`w-full h-full text-[24px] text-red font-extrabold text-center`}
        >
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="w-full h-auto text-left mb-5">
          잘못된 접근입니다.
          <br /> 서비스 이용에 불편을 드려 죄송합니다.
        </p>

        <Link href="/" className="w-full h-auto">
          <BtnStyle size="medium">홈으로 돌아가기</BtnStyle>
        </Link>
      </div>
    </section>
  );
};

export default notFound;
