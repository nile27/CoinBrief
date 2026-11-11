import DarkBtn from "../DarkMode/DarkBtn";
import LogoD from "@/../public/LOGO-D.svg?react";
import { AlignJustify, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link, useLocation } from "react-router";
import { useAuthStore } from "@/store/store";
import { useLogout } from "@/lib/session";


const Header = () => {
  const navList = ["내 코인", "코인리스트"];
  const navLink = ["/mycoin", "/coinlist/1"];
  const { pathname } = useLocation();

  const { isLogin } = useAuthStore();

  const handleLogout = useLogout();

  const navClass =
    "text-[15px] font-medium text-muted transition-colors hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark";
  const isHome = pathname === "/";

  return (
    <header className="flex h-[10vh] min-h-[56px] w-full items-center border-b border-border bg-background px-6 text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark mobile:px-4">
      <Link
        to={isLogin ? "/mycoin" : "/"}
        aria-label="CoinBrief 홈"
        className="flex shrink-0 items-center text-ink dark:text-ink-dark"
      >
        <LogoD />
      </Link>

      {isLogin ? (
        <nav
          aria-label="주요 메뉴"
          className="flex h-full w-full items-center justify-between pl-10 tablet:justify-end tablet:pl-0"
        >
          <ul className="flex h-full items-center gap-8 tablet:hidden">
            {navList.map((items: string, key: number) => (
              <li key={key} className="flex items-center">
                <Link
                  to={navLink[key]}
                  className={`${navClass} ${
                    pathname?.startsWith(navLink[key].replace(/\/1$/, ""))
                      ? "!text-ink dark:!text-ink-dark"
                      : ""
                  }`}
                >
                  {items}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="계정 메뉴">
                  <UserRound strokeWidth={1.75} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={"/mypage"}>마이페이지</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DarkBtn />
            <div className="hidden tablet:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="메뉴">
                    <AlignJustify strokeWidth={1.75} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navList.map((items: string, key: number) => (
                    <DropdownMenuItem key={key} asChild>
                      <Link to={navLink[key]}>{items}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      ) : (
        <nav
          aria-label="계정"
          className="ml-auto flex items-center gap-5"
        >
          {/* 홈 히어로에 로그인/회원가입이 이미 있어, 헤더에는 조용한 텍스트 링크만 둔다.
              홈에서는 '로그인' 하나만, 다른 화면에서는 둘 다 보여준다. */}
          <Link to={"/login"} className={navClass}>
            로그인
          </Link>
          {!isHome && (
            <Link to={"/signup"} className={navClass}>
              회원가입
            </Link>
          )}
          <DarkBtn />
        </nav>
      )}
    </header>
  );
};

export default Header;
