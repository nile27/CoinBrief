// 서버 전용: 한국수출입은행 환율 API에서 USD/KRW 매매기준율을 가져온다.
// 영업일 11시 전후 고시, 비영업일/고시 전에는 빈 응답이므로 최대 7일 전까지 거슬러 올라간다.

export interface UsdKrw {
  rate: number;
  /** 고시일 (YYYY-MM-DD, KST) */
  date: string;
}

interface ExchangeRow {
  result: number;
  cur_unit: string;
  deal_bas_r: string;
}

const MAX_LOOKBACK_DAYS = 7;

const kstFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 오늘(KST)에서 daysBack일 전의 YYYY-MM-DD */
function kstDate(daysBack: number): string {
  return kstFormatter.format(Date.now() - daysBack * 86_400_000);
}

export async function getUsdKrw(): Promise<UsdKrw | null> {
  const url = process.env.EXCHANGE_API_URL;
  const key = process.env.EXCHANGE_API_KEY;
  if (!url || !key) {
    console.error("환율 API 설정 누락");
    return null;
  }

  try {
    for (let i = 0; i <= MAX_LOOKBACK_DAYS; i++) {
      const date = kstDate(i);
      const searchdate = date.replace(/-/g, "");
      const res = await fetch(
        `${url}?authkey=${key}&searchdate=${searchdate}&data=AP01`,
        
      );
      if (!res.ok) {
        console.error("환율 API HTTP 오류:", res.status);
        return null;
      }
      const rows: ExchangeRow[] | null = await res.json();
      if (!Array.isArray(rows) || rows.length === 0) continue; // 비영업일/고시 전

      const code = rows[0]?.result;
      if (code !== 1) {
        console.error("환율 API result 코드:", code);
        return null;
      }
      const usd = rows.find((r) => r.cur_unit === "USD");
      const rate = usd ? Number(usd.deal_bas_r.replace(/,/g, "")) : NaN;
      if (!Number.isFinite(rate) || rate <= 0) continue;
      return { rate, date };
    }
    console.error("환율 API: 최근 7일 고시 없음");
    return null;
  } catch (e) {
    console.error("환율 조회 실패:", e instanceof Error ? e.message : "unknown");
    return null;
  }
}
