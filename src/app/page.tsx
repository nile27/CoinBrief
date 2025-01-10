"use client";
import { useUserStore } from "@/store/store";
import LoginMain from "@/components/Main/LoginMain";
import Footer from "@/components/CustomUI/Footer";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUserStore();
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <main className="flex w-[100vw] h-[90vh]  flex-col items-center justify-between bg-theme-primary">
      <LoginMain />
      <Footer />
    </main>
  );
}
