"use client";

const CoinImg = ({ id, name }: { id: string; name: string }) => {
  const imgSrc = `https://static.coinpaprika.com/coin/${id}/logo.png`;

  const addDefaultImg = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/CoinBrief.svg";
  };

  return (
    <>
      <img
        src={imgSrc}
        alt={name}
        onError={addDefaultImg}
        className="w-6 h-6 rounded-full"
      />
    </>
  );
};

export default CoinImg;
