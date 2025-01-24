import DetailNews from "./DetailNews";
const DetailNewsList = async ({ coinName }: { coinName: string }) => {
  const newsFetch = await fetch(
    `https://newsapi.org/v2/everything?q=${coinName}&pageSize=10&language=ko&apiKey=${process.env.NEWS_API_KEY}`
  );

  const newsData = await newsFetch.json();

  const sliceNews = newsData.articles.slice(0, 4);
  return (
    <ul className=" w-full h-auto gap-2 flex justify-start items-center overflow-y-auto px-8 py-5 border-border dark:border-border-dark border rounded-lg ">
      {sliceNews.map((item: any) => (
        <DetailNews
          key={item.title}
          url={item.url}
          title={item.title}
          urlToImage={item.urlToImage}
          source={item.source.name}
        />
      ))}
    </ul>
  );
};

export default DetailNewsList;
