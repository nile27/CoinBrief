import { headers } from "next/headers";

export async function sessionCheck() {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return null;

  try {
    const res = await fetch(
      `${process.env.API_URL ?? "http://localhost:4100"}/api/me`,
      { headers: { cookie }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const me = await res.json();
    return {
      isAuthenticated: true,
      uid: me.uid as string,
      email: me.email as string | undefined,
      displayName: me.displayName as string,
    };
  } catch (error) {
    console.error("세션 확인 실패:", error);
    return null;
  }
}
