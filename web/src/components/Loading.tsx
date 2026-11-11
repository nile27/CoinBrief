const Loading = () => {
  return (
    <div
      role="status"
      aria-label="불러오는 중"
      className="m-0 flex h-[90vh] w-full items-center justify-center p-0"
    >
      <div className="flex gap-2 font-serif text-smallHeader text-muted dark:text-muted-dark">
        <span className="animate-[blur_3s_infinite_0ms]">L</span>
        <span className="animate-[blur_3s_infinite_200ms]">O</span>
        <span className="animate-[blur_3s_infinite_400ms]">A</span>
        <span className="animate-[blur_3s_infinite_800ms]">D</span>
        <span className="animate-[blur_3s_infinite_1200ms]">I</span>
        <span className="animate-[blur_3s_infinite_1400ms]">N</span>
        <span className="animate-[blur_3s_infinite_1600ms]">G</span>
      </div>
    </div>
  );
};

export default Loading;
