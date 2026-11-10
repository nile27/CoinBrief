import { Link } from "react-router";
import styles from "./Landing.module.css";
import { formatKRWPrice } from "@/utill/utill";
import { useExchange, usePopularCoins } from "@/lib/queries";

// "2026-11-10" -> "11/10"
const shortDate = (d: string) => `${d.slice(5, 7)}/${d.slice(8, 10)}`;

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// 표시 소수(2자리)로 한 번만 반올림. "+ 0"은 -0 을 0 으로 만든다(-0.00% 방지).
const round2 = (p: number) => Math.round(p * 100) / 100 + 0;
const trend = (r: number) => (r > 0 ? "up" : r < 0 ? "down" : "flat");

const Landing = () => {
  const popular = usePopularCoins();
  const exchange = useExchange();
  const coins = popular.data?.coins ?? [];
  const fetchedAt = popular.data?.fetchedAt ?? null;
  const usd = exchange.data;
  return (
    <div className={styles.root}>
      <div className={`${styles.wrap} ${styles.screen}`}>
        <section className={styles.intro}>
          <h1 className={`${styles.h1} ${styles.serif}`}>
            내가 보는 코인만, 조용하고 간결하게.
          </h1>
          <p className={styles.lead}>
            관심 있는 코인을 한곳에 모아 두고, 필요할 때 바로 확인하세요.
          </p>
          <div className={styles.actions}>
            <Link to="/login" className={styles.btn}>
              로그인
            </Link>
            <Link to="/signup" className={styles.textLink}>
              회원가입
            </Link>
          </div>
        </section>

        <section className={styles.market} aria-label="오늘의 인기 코인">
          <div className={styles.marketHead}>
            <h2 className={styles.marketTitle}>오늘의 인기 코인</h2>
            <span className={styles.marketMeta}>
              {fetchedAt
                ? `24시간 거래대금 순 · ${timeFormatter.format(fetchedAt)} 기준`
                : "24시간 거래대금 순"}
            </span>
          </div>

          {coins.length > 0 ? (
            <ul className={styles.grid}>
              {coins.map((c) => {
                const pct = round2(c.changePercent);
                const t = trend(pct);
                const sign = t === "up" ? "+" : "";
                return (
                  <li key={c.market} className={styles.coin}>
                    <div className={styles.coinTop}>
                      <span className={styles.coinName}>{c.koreanName}</span>
                      <span className={styles.coinSymbol}>{c.symbol}</span>
                    </div>
                    <div className={styles.price}>
                      <span className={styles.won}>₩</span>
                      {formatKRWPrice(c.price)}
                    </div>
                    <div className={`${styles.change} ${styles[t]}`}>
                      <span aria-hidden="true">
                        {t === "up" ? "▲" : t === "down" ? "▼" : "–"}
                      </span>
                      {sign}
                      {pct.toFixed(2)}%
                      <span className={styles.srOnly}>
                        {t === "up" ? " 상승" : t === "down" ? " 하락" : " 보합"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.empty}>
              {popular.isPending ? "\u00a0" : "시세를 불러오지 못했습니다"}
            </p>
          )}

          {usd && (
            <p className={styles.fx}>
              USD/KRW {usd.USD.toLocaleString("en-US", { maximumFractionDigits: 2 })} ·{" "}
              {shortDate(usd.date)} 수출입은행 고시
            </p>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerInner}`}>
          <span>CoinBrief</span>
          <div className={styles.footerLinks}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.figma.com/design/xxO2ItVjjcXe3QsYKTmkPR/coin_project?node-id=4-2&p=f&t=DBAnGhVx8fhAQNCT-0"
            >
              Figma
            </a>
            <a target="_blank" rel="noreferrer" href="https://github.com/nile27/CoinBrief">
              Github
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
