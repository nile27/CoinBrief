const Loading = () => {
  return (
    <div>
      <div
        className={`bg-transprents m-0 p-0 h-[100vh] w-[100vw] flex justify-center items-center relative`}
      >
        <div
          className={`bg-transprents rounded-xl m-0 p-0 h-[300px] w-[300px] flex justify-center items-center relative`}
        >
          <div className="flex gap-3 text-H text-text dark:text-text-dark relative">
            <span className=" animate-[blur_3s_infinite_0ms]">L</span>
            <span className=" animate-[blur_3s_infinite_200ms]">O</span>
            <span className=" animate-[blur_3s_infinite_400ms]">A</span>
            <span className="animate-[blur_3s_infinite_800ms]">D</span>
            <span className=" animate-[blur_3s_infinite_1200ms]">E</span>
            <span className=" animate-[blur_3s_infinite_1400ms]">R</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
