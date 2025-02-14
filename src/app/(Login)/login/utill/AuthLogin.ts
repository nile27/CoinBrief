import { auth, firestore } from "@/firebase/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Iuser } from "@/store/store";

export const googleLogin = async (): Promise<Iuser | null> => {
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
      const signedUserData = signedUserDoc.data() as Iuser;
      const uid = signedUserDoc.id;
      return {
        ...signedUserData,
        id: uid,
      };
    }

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as Iuser;
    }

    const newUser: Iuser = {
      id: user.uid,
      name: user.displayName || "",
      email: user.email,
      displayName: user.displayName || "",
      mycoin: [],
    };

    await setDoc(userRef, newUser);

    const userData: Iuser = {
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
  const url = `${process.env.NEXT_PUBLIC_KAKAO_TOKEN_URL}/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL}&response_type=code`;
  window.location.href = url;
};
