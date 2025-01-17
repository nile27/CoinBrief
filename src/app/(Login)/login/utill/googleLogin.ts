import { auth, firestore } from "@/firebase/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Iuser } from "@/store/store";

export const googleLogin = async (): Promise<Iuser | undefined> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const iuser: Iuser = {
      name: user.displayName || "",
      email: user.email || "",
      displayName: user.displayName || "",
      mycoin: [],
    };

    if (!userSnap.exists()) {
      await setDoc(userRef, iuser);
    }
    return iuser;
  } catch (error) {
    console.error("Error during login:", error);
  }
};
