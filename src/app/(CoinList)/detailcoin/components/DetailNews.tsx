import React from "react";
import Link from "next/link";

interface IProps {
  url: string;
  title: string;
  urlToImage: string;

  source: string;
}

const DetailNews = (props: IProps) => {
  const { url, title, urlToImage, source } = props;

  return (
    <Link href={url}>
      <div className="w-[320px] h-[302px] flex flex-col gap-2 border-border dark:border-border-dark border p-2 rounded-[10px] ">
        <p className=" text-right w-full h-auto text-small dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
          {source}
        </p>
        <img
          src={urlToImage}
          alt="기사 이미지"
          className=" bg-slate-400 w-[300px] h-[200px] rounded-[10px]"
        ></img>
        <h1 className="font-semibold text-smallHeader dark:text-text-dark text-text px-1 ">
          {title}
        </h1>
      </div>
    </Link>
  );
};

export default DetailNews;
