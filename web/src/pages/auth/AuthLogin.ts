import type { User } from "@/type/type";

// 팝업은 클릭 직후에 열려야 하므로 로그인 화면이 뜨면 미리 받아 둔다
export const preloadFirebase = () =>
  Promise.all([import("@/firebase/firebase"), import("firebase/auth"), import("firebase/firestore")]);

export const googleLogin = async (): Promise<User | null> => {
  const [{ auth, firestore }, { signInWithPopup, GoogleAuthProvider }, { doc, getDoc, setDoc, collection, query, where, getDocs }] =
    await preloadFirebase();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user.email) {
      throw new Error("이메일을 찾을 수 없습니다.");
    }

    const signedUser = query(
      collection(firestore, "users"),
      where("email", "==", user.email)
    );
    const querySnapshot = await getDocs(signedUser);

    const token = await user.getIdToken();

    await fetch("/api/setsession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!querySnapshot.empty) {
      const signedUserDoc = querySnapshot.docs[0];
      const signedUserData = signedUserDoc.data() as User;
      const uid = signedUserDoc.id;
      return {
        ...signedUserData,
        id: uid,
      };
    }

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    }

    const newUser: User = {
      id: user.uid,
      name: user.displayName || "",
      email: user.email,
      displayName: user.displayName || "",
      mycoin: [],
    };

    await setDoc(userRef, newUser);

    const userData: User = {
      id: user.uid,
      name: user.displayName || "",
      email: user.email,
      displayName: user.displayName || "",
      mycoin: [],
    };

    return userData;
  } catch (error) {
    console.error("잘못된 회원 가입입니다.", error);
    return null;
  }
};

export const kakaoLogin = () => {
  const url = `${import.meta.env.VITE_KAKAO_TOKEN_URL}/authorize?client_id=${import.meta.env.VITE_KAKAO_API_KEY}&redirect_uri=${window.location.origin}/kakaocb&response_type=code`;
  window.location.href = url;
};
