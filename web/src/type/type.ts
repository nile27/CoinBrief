export interface CoinDetails {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface TickerData {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;

  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;

  change: "RISE" | "FALL" | "EVEN";
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;

  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;

  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;

  timestamp: number;
}

export interface ProcessedCoin extends TickerData, CoinDetails {
  symbol: string;
}

// 내 코인 / 검색용 코인 (Firestore)
export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

export type CoinSymbol = Pick<Coin, "id" | "symbol">;

export interface User {
  id: string;
  name: string;
  email: string;
  mycoin: Coin[];
  displayName: string;
}

export interface PopularCoin {
  market: string;
  symbol: string;
  koreanName: string;
  price: number;
  changePercent: number;
}

export interface StaticData {
  acc_trade_volume_24h: number;
  acc_trade_price_24h: number;
  high_price: number;
  low_price: number;
}

export interface KlineCandle {
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
}

// socket.io "upbit_data" 메시지
export interface UpbitData extends StaticData {
  market: string;
  trade_price: number;
  change_rate: number;
  code: string;
  change: string;
}
