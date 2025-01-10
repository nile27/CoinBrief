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
