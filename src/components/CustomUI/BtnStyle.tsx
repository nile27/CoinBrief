import clsx from "clsx";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
type BtnInterface = React.ComponentProps<"button"> & {
  size: "default" | "XL" | "small" | "medium" | "calc" | "change";
  children: any;
};

const BtnStyle = ({ size, children, ...restBtnProps }: BtnInterface) => {
  const buttonVariants = cva("", {
    variants: {
      size: {
        default: "w-12 h-12 ",
        XL: `w-full h-[70px] text-[20px] `,
        small: "w-[80px] h-[40px] text-[16px] ",
        change: "w-[100px] h-[40px]",
        medium: `w-full h-[50px] `,
        calc: `w-full h-[40px] `,
      },
    },
    defaultVariants: {
      size: "default",
    },
  });
  return (
    <button
      {...restBtnProps}
      className={cn(
        buttonVariants({ size }),
        "text-white bg-btn dark:bg-btn-dark  hover:bg-hover dark:hover:bg-hover-dark font-semibold rounded-[10px]"
      )}
    >
      {children}
    </button>
  );
};

export default BtnStyle;
