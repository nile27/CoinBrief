import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function POST(req: Request) {
  const clientId = process.env.Naver_Client_Id;
  const clientSecret = process.env.Naver_Client_Secret;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing Naver API credentials" },
      { status: 500 }
    );
  }

  const fetchImageFromArticle = async (url: string) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const html = await response.text();

      const dom = new JSDOM(html);
      const metaTag = dom.window.document.querySelector(
        'meta[property="og:image"]'
      ) as HTMLMetaElement;
      return metaTag ? metaTag.content : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching article image:", error.message);
      }

      return null;
    }
  };

  try {
    const body = await req.json();
    const query = "도지 코인"; //body.query || "암호화폐";
    const encodedQuery = encodeURIComponent(query || "암호화폐");

    const url = `https://openapi.naver.com/v1/search/news.json?query=${"도지코인"}&display=4&sort=sim`;

    const response = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    const newsData = await response.json();

    const newsWithImages = await Promise.all(
      newsData.items.map(async (item: any) => {
        const imageUrl = await fetchImageFromArticle(item.link);
        console.log("뉴스", item);
        return {
          title: item.title.replace(/<[^>]+>/g, ""),
          link: item.link,
          description: item.description.replace(/<[^>]+>/g, ""),
          pubDate: new Date(item.pubDate).toLocaleString(),
          image: imageUrl || "기본 이미지 URL",
        };
      })
    );

    return NextResponse.json(newsWithImages);
  } catch (error) {
    if (error instanceof Error)
      console.error("Error fetching news:", error.message);
    return NextResponse.json(
      { error: "new Data server Error" },
      { status: 500 }
    );
  }
}
