import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/DarkMode/Theme-provider";
import Header from "@/components/CustomUI/Header";

const sans = Noto_Sans_KR({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-sans",
});
const serif = Noto_Serif_KR({
  weight: ["500", "600"],
  display: "swap",
  preload: false,
  variable: "--font-serif",
});
const openGraph = {
  url: process.env.NEXT_PUBLIC_OPENGRAPH,
  image: process.env.NEXT_PUBLIC_OPENGRAPH_IMAGE,
};
export const metadata: Metadata = {
  title: {
    template: "%s | CoinBrief",
    default: "CoinBrief",
  },
  description: "CoinBrief",
  icons: {
    icon: "/CoinBrief.svg",
  },
  openGraph: {
    title: "CoinBrief",
    description: "CoinBrief",
    url: openGraph.url,
    siteName: "CoinBrief",
    images: [
      {
        url: openGraph.image as string,
        width: 800,
        height: 600,
      },
    ],

    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body className={`${sans.variable} ${serif.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
