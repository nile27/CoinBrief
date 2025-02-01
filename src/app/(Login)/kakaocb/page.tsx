"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useUserStore, useAuthStore } from "@/store/store";
import Loading from "@/app/loading";

const KakaoCallback = () => {
  const { setUser } = useUserStore();
  const { login } = useAuthStore();
  const navi = useRouter();
  useEffect(() => {
    const handleKakaoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("잘못된 접근입니다.");
        navi.push("/");
        return;
      }

      try {
        const tokenRes = await fetch(
          `${process.env.NEXT_PUBLIC_KAKAO_TOKEN_URL}/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: process.env.NEXT_PUBLIC_KAKAO_API_KEY || "",
              redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL || "",
              code,
            }),
          }
        );

        if (!tokenRes.ok) {
          throw new Error(`토큰 정보를 받을 수 없습니다`);
        }
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        const userInfoRes = await fetch(
          `${process.env.NEXT_PUBLIC_KAKAO_KAPI_URL}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!userInfoRes.ok) throw new Error("유저 정보를 받을 수 없습니다.");

        const userInfo = await userInfoRes.json();
        const email = userInfo.kakao_account.email;
        const displayName = userInfo.properties.nickname;

        const customTokenRes = await fetch("/api/oauthemail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: displayName, displayName }),
        });

        if (!customTokenRes.ok)
          throw new Error("토큰 정보를 받을 수 없습니다.");

        const { customToken, user } = await customTokenRes.json();

        const auth = getAuth();
        const userCredential = await signInWithCustomToken(auth, customToken);
        const userData = {
          id: userCredential.user.uid,
          displayName: user.displayName,
          name: user.name,
          mycoin: user.mycoin,
          email: user.email,
        };

        setUser(userData);
        login();
        navi.push("/mycoin");
      } catch (error) {
        console.error("Kakao 로그인 에러:", error);
      }
    };

    handleKakaoLogin();
  }, []);

  return (
    <div className=" w-full h-full flex justify-center items-center">
      <Loading />
    </div>
  );
};

export default KakaoCallback;
