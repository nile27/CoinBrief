import React from "react";

const NewsLi = () => {
  return (
    <article className=" w-full  flex items-center gap-10 min-h-[270px] border-b border-border dark:border-border-dark">
      <div className=" w-[300px] h-[200px] rounded-md bg-slate-500"></div>
      <div className=" w-full flex flex-col h-full justify-between  gap-10 ">
        <div className=" flex w-full justify-between items-center">
          <h2 className=" text-smallHeader font-semibold">
            "산유국 되나" 尹 한 마디에 한국석유 또 '上'…석유주 훨훨
          </h2>
          <div className=" w-auto h-auto flex gap-2">
            <span className="dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
              6시간전
            </span>
            <span>・</span>
            <span className="dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
              00일보
            </span>
          </div>
        </div>
        <p className=" h-[100px] text-ellipsis line-clamp-4">
          윤석열 대통령이 "포항 앞바다에 막대한 양의 석유·천연가스 매장 가능성이
          있다"고 발표하면서 석유주가 이틀째 급등했다.3일 한국석유(004090)는
          전일대비 5350원(29.81%) 오른 2만3300원에 거래를 마쳤다. 한국석유는
          전날에도 상한가로 장을 마친 바 있다.이 외에도 한국ANKOR유전도 상한가를
          찍었고, 흥구석유(024060)는 18.40% 올랐다. 윤석열 대통령은 전날 용산
          대통령실에서 열린 국정 브리핑에서 "포항 영일만 앞바다에 막대한 양의
          석유와 가스가 매장돼 있을 가능성이 높다는 물리탐사 결과가 나왔다"고
          밝혔다.매장량은 최대 140억 배럴 가능성이 예상되며 천연가스는 29년,
          석유는 4년 이상 사용할 양이라고 설명했다. 있을 가능성이 높다는
          물리탐사 결과가 나왔다"고 밝혔다.매장량은 최대 140억 배럴 가능성이
          예상되며 천연가스는 29년, 석유는 4년 이상 사용할 양이라고 설명했다.
        </p>
      </div>
    </article>
  );
};

export default NewsLi;
