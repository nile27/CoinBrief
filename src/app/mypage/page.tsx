"use client";

import { useState } from "react";
import { useUserStore } from "@/store/store";

import DeleteModal from "./components/DeleteModal";

const Mypage = () => {
  const { user } = useUserStore.getState();

  const [isModal, setIsModal] = useState<boolean>(false);

  return (
    <section className=" w-full h-full flex flex-col ">
      <div className=" w-full h-full flex flex-col justify-start items-center ">
        <div className="flex px-5 pt-5 pb-10 flex-col justify-center items-center min-w-[350px] h-auto border rounded-lg border-border dark:border-border-dark">
          <div className="w-full h-auto">
            <h1 className=" px-5 pb-5 text-header font-bold text-primary dark:text-primary-dark">
              My Page
            </h1>
          </div>
          <div className=" w-full h-auto flex flex-col gap-7">
            <div className="flex justify-start items-start flex-col gap-2">
              <span className="pl-2 w-auto h-auto whitespace-nowrap text-lg font-bold">
                이름
              </span>
              <span className="w-full h-auto text-md rounded-md border border-border dark:border-border-dark bg-container px-2 py-1 dark:bg-container-dark">
                {user.name}
              </span>
            </div>
            <div className="flex justify-start items-start flex-col gap-2">
              <span className="pl-2 w-auto h-auto whitespace-nowrap text-lg font-bold">
                E-MAIL
              </span>
              <span className="w-full h-auto text-md rounded-md border border-border dark:border-border-dark bg-container px-2 py-1 dark:bg-container-dark">
                {user.email}
              </span>
            </div>
            <div className="flex justify-start items-start flex-col gap-2">
              <span className="pl-2 w-auto h-auto whitespace-nowrap text-lg font-bold">
                닉네임
              </span>
              <span className="w-full h-auto text-md rounded-md border border-border dark:border-border-dark bg-container px-2 py-1 dark:bg-container-dark">
                {user.displayName}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsModal(true)}
            className=" w-[100px] mt-10  px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
          >
            회원탈퇴
          </button>
        </div>
      </div>
      {isModal && <DeleteModal id={user.id} setIsModal={setIsModal} />}
    </section>
  );
};

export default Mypage;
