"use client";

import { useEffect } from "react";
import { useCoinStore } from "@/store/store";

// 서버에서 받은 USD/KRW 환율을 스토어에 반영한다. (화면 출력 없음)
const ExchangeSync = ({ rate }: { rate: number | null }) => {
  const setExchange = useCoinStore((s) => s.setExchange);
  useEffect(() => {
    if (rate && rate > 0) setExchange(rate);
  }, [rate, setExchange]);
  return null;
};

export default ExchangeSync;
