import { NextResponse } from "next/server";

interface ExchangeInterface {
  result: number;
  cur_unit: string; // 통화 단위 (예: USD)
  ttb: string; // 매입 환율 (은행이 구매할 때의 환율)
  tts: string; // 매도 환율 (은행이 판매할 때의 환율)
  deal_bas_r: string; // 기준 환율 (매입과 매도 환율의 평균)
  bkpr: string; // 현찰 기준 환율
  yy_efee_r: string; // 연간 수수료율 (사용되지 않는 경우 0)
  ten_dd_efee_r: string; // 10일 수수료율 (사용되지 않는 경우 0)
  kftc_bkpr: string; // KFTC(한국금융결제원) 현찰 기준 환율
  kftc_deal_bas_r: string; // KFTC 기준 환율
  cur_nm: string;
}

export async function GET() {
  try {
    const response = await fetch(
      `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.EXCHANGE_API_KEY}&searchdate=20250113&data=AP01`
    );
    const data = await response.json();
    const exchange = data.filter(
      (item: ExchangeInterface) =>
        item.cur_unit === "KRW" || item.cur_unit === "USD"
    );

    return NextResponse.json(
      {
        message: "실시간 연결이 성공하였습니다.",
        data: {
          USD: exchange[0].kftc_deal_bas_r,
          KRW: exchange[1].kftc_deal_bas_r,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "실시간 연결이 실패하였습니다." },
      { status: 500 }
    );
  }
}
