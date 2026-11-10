import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/DarkMode/Theme-provider";
import Header from "@/components/CustomUI/Header";
import Footer from "@/components/CustomUI/Footer";
import RequireAuth from "@/components/RequireAuth";
import CoinListPage from "@/pages/CoinListPage";
import NotFound from "@/pages/NotFound";
import { Placeholder } from "@/pages/Placeholder";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const Layout = () => (
  <>
    <Header />
    <main className="flex min-h-[90vh] w-full flex-col items-center justify-between">
      <Outlet />
      <Footer />
    </main>
  </>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {["/", "/login", "/signup", "/signend", "/pwfind", "/pwchange", "/kakaocb"].map((p) => (
                <Route key={p} path={p} element={<Placeholder />} />
              ))}
              <Route element={<RequireAuth />}>
                <Route path="/mycoin" element={<Placeholder />} />
                <Route path="/coinlist/:page" element={<CoinListPage />} />
                <Route path="/detailcoin/:id/:name" element={<Placeholder />} />
                <Route path="/mypage" element={<Placeholder />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
