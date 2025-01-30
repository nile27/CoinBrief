import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
type BtnInterface = React.ComponentProps<"button"> & {
  size: "default" | "XL" | "small" | "medium" | "calc" | "change" | "auto";
  color?: "default" | "focus";
  children: any;
};

const BtnStyle = ({
  size,
  color = "default",
  children,
  ...restBtnProps
}: BtnInterface) => {
  const buttonVariants = cva("", {
    variants: {
      size: {
        default: "w-12 h-12 ",
        XL: `w-full h-[70px] text-[20px] `,
        small: "w-[80px] h-[40px] text-[16px] ",
        change: "w-[100px] h-[40px]",
        medium: `w-full h-[50px] `,
        calc: `w-full h-[40px] `,
        auto: `px-3 py-2 w-auto h-auto text-[14px]`,
      },
      color: {
        default:
          "disabled:bg-[#f1f5f9] disabled:dark:text-text-dark dark:disabled:bg-container-dark disabled:text-text bg-btn dark:bg-btn-dark  hover:bg-hover dark:hover:bg-hover-dark",
        focus:
          "bg-[#f1f5f9] dark:text-text-dark dark:bg-container-dark disabled:text-text  disabled:bg-gray-200 dark:disabled:bg-gray-700  hover:bg-gray-200 dark:hover:bg-gray-700",
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
        buttonVariants({ size, color }),
        " font-semibold rounded-[10px] whitespace-nowrap"
      )}
    >
      {children}
    </button>
  );
};

export default BtnStyle;
