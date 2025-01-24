import NewsLi from "./components/NewsLi";

const News = () => {
  return (
    <section className=" w-full h-auto flex flex-col p-10 gap-10">
      <h1 className=" text-header font-extrabold ml-10">뉴스 리스트</h1>
      <section className=" w-full h-auto px-10">
        <NewsLi />
        <NewsLi />
        <NewsLi />
        <NewsLi />
        <NewsLi />
      </section>
    </section>
  );
};

export default News;
