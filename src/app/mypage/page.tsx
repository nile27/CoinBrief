"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/store";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import DeleteModal from "./components/DeleteModal";

interface UserData {
  displayName: string;
  name: string;
  email: string;
  mycoin: [];
}

const Mypage = () => {
  const { id } = useUserStore.getState().user;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isModal, setIsModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
          console.log(docSnap.data());
        } else {
          console.log("유저 데이터를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("유저 데이터 가져오기 실패:", error);
      }
    };

    fetchUserData();
  }, [id]);

  if (!userData) {
    return (
      <section className=" w-full h-full flex flex-col ">
        <h1 className="mt-15 lt-15 text-header font-bold text-primary dark:text-primary-dark">
          My Page
        </h1>
        <div className=" w-full h-full flex justify-center items-center ">
          <div>Loading...</div>;
        </div>
      </section>
    );
  }

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
                {userData.name}
              </span>
            </div>
            <div className="flex justify-start items-start flex-col gap-2">
              <span className="pl-2 w-auto h-auto whitespace-nowrap text-lg font-bold">
                E-MAIL
              </span>
              <span className="w-full h-auto text-md rounded-md border border-border dark:border-border-dark bg-container px-2 py-1 dark:bg-container-dark">
                {userData.email}
              </span>
            </div>
            <div className="flex justify-start items-start flex-col gap-2">
              <span className="pl-2 w-auto h-auto whitespace-nowrap text-lg font-bold">
                닉네임
              </span>
              <span className="w-full h-auto text-md rounded-md border border-border dark:border-border-dark bg-container px-2 py-1 dark:bg-container-dark">
                {userData.displayName}
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
      {isModal && <DeleteModal id={id} setIsModal={setIsModal} />}
    </section>
  );
};

export default Mypage;
