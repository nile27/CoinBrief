import Footer from "@/components/CustomUI/Footer";

export const metadata = {
  title: "MyCoin",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" flex w-[100vw] h-[90vh] items-center justify-between flex-col p-5">
      {children}
      <Footer />
    </main>
  );
}
