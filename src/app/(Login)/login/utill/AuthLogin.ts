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

    if (!querySnapshot.empty) {
      const signedUserData = querySnapshot.docs[0].data() as Iuser;

      return signedUserData;
    }

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as Iuser;
    }

    const newUser: Iuser = {
      name: user.displayName || "",
      email: user.email,
      displayName: user.displayName || "",
      mycoin: [],
    };

    await setDoc(userRef, newUser);

    return newUser;
  } catch (error) {
    console.error("잘못된 회원 가입입니다.", error);
    return null;
  }
};

export const kakaoLogin = () => {
  const url = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL}&response_type=code`;
  window.location.href = url;
};
