export const encodeBase64 = (data: string): string => {
  return btoa(String.fromCharCode(...new TextEncoder().encode(data)));
};

export const decodeBase64 = (data: string): string => {
  return new TextDecoder().decode(Uint8Array.from(atob(data), (c) => c.charCodeAt(0)));
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

// 원화 시세 표시용: 100원 미만은 소수점(최대 4자리), 1,000원 미만은 최대 1자리, 이상은 정수 + 천 단위 구분.
export function formatKRWPrice(value: number): string {
  if (value >= 1000) return Math.round(value).toLocaleString("ko-KR");
  if (value >= 100) return value.toLocaleString("ko-KR", { maximumFractionDigits: 1 });
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}
