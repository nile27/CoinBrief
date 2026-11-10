"use client";

import { useEffect, useState } from "react";
import { useUserStore, useAuthStore } from "@/store/store";
import DeleteModal from "./components/DeleteModal";
import notFound from "../not-found";

const Mypage = () => {
  const { user } = useUserStore.getState();
  const { isLogin } = useAuthStore.getState();
  const [isModal, setIsModal] = useState<boolean>(false);
  // 서버에는 로그인 상태(zustand)가 없어 첫 렌더를 비워 hydration 불일치를 피한다
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!isLogin) {
    return notFound();
  }

  return (
    <section className="flex w-full flex-1 justify-center px-4 py-10">
      <div className="flex w-full max-w-[480px] flex-col gap-8">
        <h1 className="font-serif text-[32px] font-semibold text-ink dark:text-ink-dark mobile:text-[26px]">
          마이페이지
        </h1>
        <dl className="flex flex-col rounded-[10px] border border-border bg-container px-6 dark:border-border-dark dark:bg-container-dark">
          {[
            ["이름", user.name],
            ["이메일", user.email],
            ["닉네임", user.displayName],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0 dark:border-border-dark"
            >
              <dt className="text-xs text-muted dark:text-muted-dark">{label}</dt>
              <dd className="break-all text-ink dark:text-ink-dark">{value}</dd>
            </div>
          ))}
        </dl>
        <button
          onClick={() => setIsModal(true)}
          className="h-10 self-start rounded-md border border-red px-4 text-sm font-semibold text-red transition-colors hover:bg-red hover:text-white"
        >
          회원탈퇴
        </button>
      </div>
      {isModal && <DeleteModal id={user.id} setIsModal={setIsModal} />}
    </section>
  );
};

export default Mypage;
