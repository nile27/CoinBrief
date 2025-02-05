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
    url: "https://coinbrief.vercel.app/",
    siteName: "CoinBrief",
    images: [
      {
        url: "https://github.com/nile27/Next_Portfolio/assets/114140840/246b5222-5752-4818-aa0d-45697fda29a1",
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
