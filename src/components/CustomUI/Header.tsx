"use client";
import DarkBtn from "../DarkMode/DarkBtn";
import LogoD from "@/../public/LOGO-D.svg";
import { AlignJustify, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

import Link from "next/link";
import { useAuthStore, useUserStore } from "@/store/store";
import BtnStyle from "./BtnStyle";
import { useRouter } from "next/navigation";

const Header = () => {
  const navList = ["내 코인", "코인리스트"];
  const navLink = ["/mycoin", "/coinlist/1"];
  const navi = useRouter();

  const { isLogin, logout } = useAuthStore();
  const { deleteUser } = useUserStore();

  const handleLogout = () => {
    logout();
    deleteUser();
    navi.push("/");
    signOut(auth);
  };

  return (
    <header
      className={`  top-0 w-full h-[10vh] flex items-center pl-[1.5rem] pr-[1.5rem] ${
        isLogin ? "justify-start" : "justify-between"
      }`}
    >
      {!isLogin ? (
        <Link href={"/"}>
          <LogoD />
        </Link>
      ) : (
        <Link href={"/mycoin"}>
          <LogoD />
        </Link>
      )}

      {isLogin ? (
        <div className=" w-full h-full flex justify-between items-center pl-[3rem] tablet:justify-end ">
          <ul className=" w-auto h-full flex justify-between items-center gap-[5rem] tablet:hidden">
            {navList.map((items: string, key: number) => {
              return (
                <li
                  className=" w-auto h-auto flex justify-center items-center  cursor-pointer  "
                  key={key}
                >
                  <span className="dark:text-text-dark  text-text text-smallHeader font-semibold border-b-[2px] border-transparent hover:border-text dark:hover:border-text-dark ">
                    <Link href={navLink[key]}>{items}</Link>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="w-auto h-full flex justify-end items-center gap-2 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background dark:bg-background-dark w-[3rem] h-[3rem] p-0 border-border dark:border-border-dark"
                >
                  <UserRound />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={"/mypage"}>마이페이지</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DarkBtn />
            <div className=" hidden tablet:flex w-auto h-auto ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background dark:bg-background-dark w-[3rem] h-[3rem] p-0 border-border dark:border-border-dark"
                  >
                    <AlignJustify />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className=" flex flex-col gap-3 p-2"
                >
                  {navList.map((items: string, key: number) => {
                    return (
                      <Link key={key} href={navLink[key]}>
                        <DropdownMenuItem className="  bg-container dark:bg-container-dark">
                          {items}
                        </DropdownMenuItem>
                      </Link>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-auto h-auto pr-[10px]">
          <div className="w-auto h-auto flex items-center gap-2">
            <Link href={"/login"}>
              <BtnStyle size="small">LOGIN</BtnStyle>
            </Link>
            <Link href={"/signup"}>
              <BtnStyle size="small">SignUp</BtnStyle>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
