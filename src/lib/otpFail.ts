import admin from "@/firebase/firebaseAdmin";

const MAX_ATTEMPTS = 5;

// 틀린 OTP 시도 1회 기록. 5회째면 OTP 삭제 후 429, 아니면 400.
export async function otpMismatch(email: string) {
  const ref = admin.firestore().collection("otps").doc(email);
  await ref.update({ attempts: admin.firestore.FieldValue.increment(1) });
  const attempts = ((await ref.get()).data()?.attempts as number) ?? 0;
  if (attempts >= MAX_ATTEMPTS) {
    await ref.delete();
    return Response.json(
      {
        message: "인증 시도 횟수를 초과했습니다. 인증 번호를 다시 받아주세요.",
      },
      { status: 429 }
    );
  }
  return Response.json(
    { message: "OTP가 일치하지 않습니다." },
    { status: 400 }
  );
}
