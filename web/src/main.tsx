import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/DarkMode/Theme-provider";
import Header from "@/components/CustomUI/Header";
import Footer from "@/components/CustomUI/Footer";
import RequireAuth from "@/components/RequireAuth";
import Loading from "@/components/Loading";

const CoinListPage = lazy(() => import("@/pages/CoinListPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/auth/Login"));
const KakaoCb = lazy(() => import("@/pages/auth/KakaoCb"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const SignEnd = lazy(() => import("@/pages/auth/SignEnd"));
const PwFind = lazy(() => import("@/pages/auth/PwFind"));
const PwChange = lazy(() => import("@/pages/auth/PwChange"));
const Placeholder = lazy(() => import("@/pages/Placeholder"));
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const Layout = () => (
  <>
    <Header />
    <main className="flex min-h-[90vh] w-full flex-col items-center justify-between">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
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
              <Route path="/" element={<Placeholder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/kakaocb" element={<KakaoCb />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signend" element={<SignEnd />} />
              <Route path="/pwfind" element={<PwFind />} />
              <Route path="/pwchange" element={<PwChange />} />
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
