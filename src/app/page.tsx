import LoginMain from "@/components/Main/LoginMain";
import Footer from "@/components/CustomUI/Footer";

export default function Home() {
  return (
    <main className="flex w-[100vw] h-[90vh]  flex-col items-center justify-between bg-theme-primary">
      <LoginMain />
      <Footer />
    </main>
  );
}
