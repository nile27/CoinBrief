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
    <main className="flex min-h-[90vh] w-full flex-col items-center justify-between">
      {children}
      <Footer />
    </main>
  );
}
