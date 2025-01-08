import React from "react";

const SignUPOTP = ({
  setIsModal,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg z-60 shadow-lg relative">
        <h2 className="text-lg font-bold mb-4">모달 제목</h2>
        <p className="text-sm text-gray-600 mb-6">
          이곳에 모달 내용을 작성하세요. 모달 외부를 클릭하면 닫힙니다. dddd
        </p>
        <button
          onClick={() => setIsModal(false)}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SignUPOTP;
