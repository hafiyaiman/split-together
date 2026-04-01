import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-150",
  {
    variants: {
      variant: {
        neutral: "border-border bg-card/75 text-foreground/70 hover:bg-card",
        success: "border-success/20 bg-success-soft text-success hover:brightness-98",
        danger: "border-danger/20 bg-danger-soft text-danger hover:brightness-98",
        accent: "border-accent/20 bg-accent-soft text-accent hover:brightness-98",
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
