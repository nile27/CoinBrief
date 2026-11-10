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
const Landing = lazy(() => import("@/pages/Landing"));
const DetailCoinPage = lazy(() => import("@/pages/DetailCoinPage"));
const MyCoinPage = lazy(() => import("@/pages/MyCoinPage"));
const MyPage = lazy(() => import("@/pages/MyPage"));
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

// 랜딩('/')은 자체 푸터를 가지므로 main+Footer 래퍼는 나머지 화면에만 쓴다
const Layout = () => (
  <>
    <Header />
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  </>
);

const WithFooter = () => (
  <main className="flex min-h-[90vh] w-full flex-col items-center justify-between">
    <Outlet />
    <Footer />
  </main>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Landing />} />
              <Route element={<WithFooter />}>
                <Route path="/login" element={<Login />} />
                <Route path="/kakaocb" element={<KakaoCb />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signend" element={<SignEnd />} />
                <Route path="/pwfind" element={<PwFind />} />
                <Route path="/pwchange" element={<PwChange />} />
                <Route element={<RequireAuth />}>
                  <Route path="/mycoin" element={<MyCoinPage />} />
                  <Route path="/coinlist/:page" element={<CoinListPage />} />
                  <Route path="/detailcoin/:id/:name" element={<DetailCoinPage />} />
                  <Route path="/mypage" element={<MyPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
