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

const Header = () => {
  const navList = ["내 코인", "코인리스트", "뉴스"];
  const { theme } = useTheme();

  const isLogin = true;

  return (
    <header
      className={` sticky top-0 w-full h-[90px] flex items-center pl-[1.5rem] pr-[1.5rem] ${
        isLogin ? "justify-start" : "justify-between"
      }`}
    >
      <LogoD />

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
                    {items}
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
                {navList.map((items: string, key: number) => {
                  return <DropdownMenuItem key={key}>{items}</DropdownMenuItem>;
                })}
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
          <button className=" bg-btn dark:bg-btn-dark w-[100px] h-[40px] hover:bg-hover dark:hover:bg-hover-dark bold rounded-[10px]">
            Login
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
