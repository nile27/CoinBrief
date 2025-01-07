import Footer from "@/components/CustomUI/Footer";

export const metadata = {
  title: "DetailCoin",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" flex w-[100vw]  min-h-[90vh] items-center justify-between flex-col gap-10 ">
      {children}
    </main>
  );
}
