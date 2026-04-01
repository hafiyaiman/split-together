import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex cursor-pointer touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold transition-all duration-150 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-ring/70 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border-black bg-black text-white shadow-sm hover:bg-[#1b1b1b]",
        secondary: "border-black/10 bg-white/80 text-foreground hover:bg-white",
        ghost:
          "border-transparent bg-transparent text-foreground/75 hover:border-black/10 hover:bg-white/60 hover:text-foreground",
        danger: "border-danger bg-danger text-white hover:bg-[#a33e30]",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
