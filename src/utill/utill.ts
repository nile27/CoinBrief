export const encodeBase64 = (data: string): string => {
  return Buffer.from(data).toString("base64");
};

export const decodeBase64 = (data: string): string => {
  return Buffer.from(data, "base64").toString("utf-8");
};

export const errorMessages = {
  nameRequired: "이름은 필수 입력 항목입니다.",
  emailRequired: "이메일은 필수 입력 항목입니다.",
  passwordRequired: "비밀번호은 필수 입력 항목입니다.",
  nicknameRequired: "닉네임은 필수 입력 항목입니다.",
  invalidEmail: "올바른 이메일 형식을 입력해주세요.",
  verifyRequired: "본인 인증을 진행해주세요.",
  passwordTooShort: "비밀번호는 최소 8자 이상이어야 합니다.",
  passwordMismatch: "비밀번호가 일치하지 않습니다.",
  passwordWrong:
    "비밀번호는 8~20자 영문, 숫자, 특수문자 중 2가지 이상 조합이어야 합니다.",
};

export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

export function formatKRW(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}조`;
  } else if (value >= 1e8) {
    return `${(value / 1e8).toFixed(2)}억`;
  }
  return `${value.toLocaleString()}`;
}

export function formatCurrency(value: number, currency: "₩" | "$"): string {
  if (currency === "₩") {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}조`;
    } else if (value >= 1e8) {
      return `${(value / 1e8).toFixed(2)}억`;
    }
    return `${value.toLocaleString()}`;
  } else if (currency === "$") {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    }
    return `${value.toLocaleString()}`;
  }

  return value.toString();
}
