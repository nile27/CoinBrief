import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";

const PwChange = () => {
  return (
    <section className=" h-full w-auto  flex  justify-center items-center">
      <div className="w-auto h-auto gap-3 px-10 py-5 flex flex-col justify-center items-center border-border dark:border-border-dark border rounded-[15px]">
        <h1
          className={` h-full  text-header font-extrabold text-start w-[388px]`}
        >
          비밀번호 변경
        </h1>

        <form className="flex flex-col gap-5 w-full h-auto  border-[rgba(113,113,113,0.8)] dark:border-[rgba(228,228,235,0.8)] pb-6">
          <div className="w-full h-auto flex flex-col gap-4 pb-2">
            <InputStyle placeholder="비밀번호 (8~20 영문 숫자, 특수문자 조합)" />
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
    </section>
  );
};

export default PwChange;
