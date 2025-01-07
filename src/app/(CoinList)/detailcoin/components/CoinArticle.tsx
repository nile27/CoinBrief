import Ellipse from "@/../public/Ellipse.svg";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import BtnStyle from "@/components/CustomUI/BtnStyle";

const CoinArticle = () => {
  return (
    <article className="w-[390px] h-auto flex flex-col gap-4 basis-1/3 ">
      <div className=" w-full h-auto flex justify-between items-center">
        <div className=" w-auto h-auto flex justify-start items-center gap-4">
          <Ellipse className=" w-[32px] h-[32px]" />
          <span className=" font-semibold text-smallHeader">BTC</span>
          <span className=" font-semibold text-smallHeader">비트 코인</span>
        </div>

        <BtnStyle size="change">통화 변경(₩)</BtnStyle>
      </div>
      <div className=" w-full h-auto flex justify-between items-center">
        <div className=" w-auto h-auto flex justify-start items-center gap-4">
          <span className=" font-semibold text-[24px]">USD</span>
          <span className=" font-semibold text-[24px]">$95,502.99</span>
        </div>

        <div className=" w-auto h-auto flex gap-2 items-center pr-1">
          <GreenArrow className=" text-green " />
          <span className={`w-auto h-auto ${true ? "text-green" : "text-red"}`}>
            2.1%
          </span>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col gap-2">
        <div className=" w-full h-auto flex justify-between items-center">
          <span>7시간</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            <GreenArrow className=" text-green " />
            <span
              className={`w-auto h-auto ${true ? "text-green" : "text-red"}`}
            >
              2.1%
            </span>
          </div>
        </div>
        <div className=" w-full h-auto flex justify-between items-center">
          <span>24시간</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            <RedArrow />
            <span
              className={`w-auto h-auto ${false ? "text-green" : "text-red"}`}
            >
              2.1%
            </span>
          </div>
        </div>
        <div className=" w-full h-auto flex justify-between items-center">
          <span>7일</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            <GreenArrow className=" text-green " />
            <span
              className={`w-auto h-auto ${true ? "text-green" : "text-red"}`}
            >
              0.1%
            </span>
          </div>
        </div>
      </div>

      <table className="w-full h-auto pt-3 ">
        <tbody className="w-full h-auto pt-3 flex flex-col gap-3">
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>시가 총액</td>
            <td>$1,901,732,884,178</td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최고가(24H)</td>
            <td>$28,450.75</td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최저가 (24H)</td>
            <td>$27,850.40</td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>유통량</td>
            <td>$19,350,250</td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>총 공급량</td>
            <td>21,000,000</td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최대 공급량</td>
            <td>21,000,000</td>
          </tr>
        </tbody>
      </table>
      <span className=" w-full text-right">Last Update 2024-12-22 08:00</span>
    </article>
  );
};

export default CoinArticle;
