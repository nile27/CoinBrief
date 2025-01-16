import DetailNews from "./DetailNews";
const DetailNewsList = async () => {
  const newsFetch = await fetch(
    `https://newsapi.org/v2/everything?q=BNB&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
  );
  const newsData = await newsFetch.json();
  console.log(newsData.articles);
  return (
    <ul className=" w-full h-auto gap-2 flex justify-start items-center overflow-y-auto px-8 py-5 border-border dark:border-border-dark border rounded-lg ">
      {newsData.articles.map((item: any) => (
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
