import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/DarkMode/Theme-provider";
import Header from "@/components/CustomUI/Header";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
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
    <html lang="en" suppressHydrationWarning={true}>
      <body className={roboto.className}>
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
