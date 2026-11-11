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
          "bg-btn text-btn-ink hover:bg-btn-hover dark:bg-btn-dark dark:text-btn-ink-dark dark:hover:bg-btn-hover-dark disabled:bg-secondary disabled:text-muted disabled:hover:bg-secondary dark:disabled:bg-secondary-dark dark:disabled:text-muted-dark dark:disabled:hover:bg-secondary-dark disabled:cursor-not-allowed",
        focus:
          "bg-secondary text-ink border border-border hover:bg-hover dark:bg-secondary-dark dark:text-ink-dark dark:border-border-dark dark:hover:bg-hover-dark disabled:text-muted disabled:cursor-not-allowed",
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
        "font-semibold rounded-md whitespace-nowrap transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-ink-dark"
      )}
    >
      {children}
    </button>
  );
};

export default BtnStyle;
