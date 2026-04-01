import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-150",
  {
    variants: {
      variant: {
        neutral: "border-black/10 bg-white/70 text-foreground/70 hover:bg-white",
        success: "border-emerald-200 bg-success-soft text-success hover:bg-emerald-50",
        danger: "border-red-200 bg-danger-soft text-danger hover:bg-red-50",
        accent: "border-teal-200 bg-[#e9fffb] text-accent hover:bg-[#dcfff8]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
