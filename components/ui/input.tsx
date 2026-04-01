import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border-0 border-b border-black/15 bg-transparent px-0 py-3 text-sm text-foreground outline-none transition duration-150 focus-visible:border-[rgba(16,179,163,0.8)] focus-visible:bg-white/20 placeholder:text-muted/70 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
