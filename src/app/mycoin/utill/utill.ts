export const searchCoinBySymbol = async (symbol: string) => {
  try {
    if (!symbol || symbol.length < 1) {
      throw new Error("2글자 이상 입력해주세요.");
    }

    const response = await fetch(
      `https://api.coinpaprika.com/v1/search?q=${symbol}&c=currencies&limit=10`
    );

    if (!response.ok) {
      throw new Error("코인파프리카 매핑 실패.");
    }

    const data = await response.json();

    const filteredResults = data.currencies.filter(
      (coin: { symbol: string }) =>
        coin.symbol.toLowerCase() === symbol.toLowerCase()
    );

    return filteredResults;
  } catch (error) {
    console.error("코인파프리카 검색 에러:", error);
    return [];
  }
};

export const coinDataFetch = async (coinId: string) => {
  try {
    if (!coinId) {
      throw new Error("잘못된 코인 정보입니다.");
    }

    const response = await fetch(
      `https://api.coinpaprika.com/v1/coins/${coinId}`
    );

    if (!response.ok) {
      throw new Error("코인파프리카 매핑 실패.");
    }

    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error("코인파프리카 검색 에러:", error);
    return [];
  }
};
