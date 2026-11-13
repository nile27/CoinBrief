import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length && process.env.FIRESTORE_EMULATOR_HOST) {
  // 에뮬레이터 테스트용: 실제 프로젝트/자격증명 없이 demo- 프로젝트로 초기화
  initializeApp({ projectId: process.env.GCLOUD_PROJECT ?? "demo-coinbrief" });
} else if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const auth = getAuth();
export const db = getFirestore();
export { FieldValue, Timestamp } from "firebase-admin/firestore";
