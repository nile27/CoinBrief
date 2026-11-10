import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// shortcut: fallback to old NEXT_PUBLIC_ names until .env is renamed, remove after
export const env = (n: string) => process.env[n] ?? process.env[`NEXT_PUBLIC_${n}`];

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: env("FIREBASE_PROJECT_ID"),
      clientEmail: env("FIREBASE_CLIENT_EMAIL"),
      privateKey: env("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
    }),
  });
}

export const auth = getAuth();
export const db = getFirestore();
export { FieldValue, Timestamp } from "firebase-admin/firestore";
