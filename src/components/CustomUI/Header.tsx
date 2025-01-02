import React from "react";
import LOGO from "@/../public/LOGO-D.svg";
import Image from "next/image";
import DarkBtn from "../DarkMode/DarkBtn";
import { AlignJustify, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navList = ["내 코인", "코인리스트", "뉴스"];
  return (
    <header className=" w-full h-[90px] flex justify-start items-center pl-[1.5rem] pr-[1.5rem] ">
      <Image src={LOGO} alt="LOGO" width={100} height={90} />
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
              <DropdownMenuContent align="end">
                {navList.map((items: string, key: number) => {
                  return <DropdownMenuItem key={key}>{items}</DropdownMenuItem>;
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
