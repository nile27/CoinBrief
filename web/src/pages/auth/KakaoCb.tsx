import { useEffect, useRef } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { finishLogin } from "@/lib/session";
import Loading from "@/components/Loading";

const KakaoCallback = () => {
  const qc = useQueryClient();
  const navi = useNavigate();

  const started = useRef(false); // StrictMode 이중 실행 방지 (카카오 code 는 1회용)
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const handleKakaoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("잘못된 접근입니다.");
        navi("/");
        return;
      }

      try {
        const tokenRes = await fetch(
          `${import.meta.env.NEXT_PUBLIC_KAKAO_TOKEN_URL}/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: import.meta.env.NEXT_PUBLIC_KAKAO_API_KEY || "",
              redirect_uri: import.meta.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL || "",
              code,
            }),
          }
        );

        if (!tokenRes.ok) {
          throw new Error(`토큰 정보를 받을 수 없습니다`);
        }
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        const customTokenRes = await fetch("/api/oauthemail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
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
        const idToken = await userCredential.user.getIdToken();
        await fetch("/api/setsession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        });
        finishLogin(qc, userData);
        navi("/mycoin");
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
