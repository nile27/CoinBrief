import { cn } from "@/lib/utils";

// 로딩 자리표시. 글자 한 줄 높이를 그대로 차지하므로(nbsp) 실제 값이 들어와도 레이아웃이 밀리지 않는다.
// 높이를 직접 줘야 하는 큰 영역(차트 등)은 className 에 h-* 를 넘기고 block 으로 쓴다.
const Skeleton = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-block rounded bg-accent align-middle dark:bg-accent-dark motion-safe:animate-pulse",
      className
    )}
  >
    &nbsp;
  </span>
);

export default Skeleton;
