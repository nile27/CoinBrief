import Header from "@/components/CustomUI/Header";
import LoginMain from "@/components/Main/LoginMain";
import Footer from "@/components/CustomUI/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex w-full h-full min-h-screen min-w-screen flex-col items-center justify-between bg-theme-primary">
      <Header />

      <Footer />
    </main>
  );
}
