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
import { useTheme } from "next-themes";

import Link from "next/link";
import { useAuthStore } from "@/store/store";
import BtnStyle from "./BtnStyle";

const Header = () => {
  const navList = ["내 코인", "코인리스트", "뉴스"];
  const navLink = ["mycoin", "mycoin", "mycoin"];
  const { theme } = useTheme();
  const { isLogin, logout } = useAuthStore();

  return (
    <header
      className={`  top-0 w-full h-[10vh] flex items-center pl-[1.5rem] pr-[1.5rem] ${
        isLogin ? "justify-start" : "justify-between"
      }`}
    >
      <Link href={"/"}>
        <LogoD />
      </Link>

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
                  <Link href={"/"}>마이페이지</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>로그아웃</DropdownMenuItem>
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
                      <DropdownMenuItem key={key} className=" text-lg">
                        {items}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-auto h-auto pr-[10px]">
          <Link href={"/login"}>
            <BtnStyle size="small">LOGIN</BtnStyle>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
