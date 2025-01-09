"use client";
import InputStyle from "@/components/CustomUI/InputStyle";
import BtnStyle from "@/components/CustomUI/BtnStyle";

import { useState } from "react";
import SignUPOTP from "./SignUPOTP";

const OTPDiv = () => {
  const [isModal, setIsModal] = useState<boolean>(false);

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsModal(!isModal);
    console.log(isModal);
  };
  return (
    <>
      <BtnStyle size="small" onClick={handleModal}>
        본인 인증
      </BtnStyle>
      {isModal && <SignUPOTP setIsModal={setIsModal} />}
    </>
  );
};

export default OTPDiv;
