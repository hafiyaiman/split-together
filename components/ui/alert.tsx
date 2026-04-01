"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const alertVariants = cva(
  "relative overflow-hidden border px-4 py-4 text-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-accent/20 bg-[linear-gradient(180deg,rgba(233,255,251,0.88),rgba(255,255,255,0.94))] text-foreground",
        warning:
          "border-warning/30 bg-[linear-gradient(180deg,rgba(255,247,231,0.96),rgba(255,255,255,0.92))] text-foreground",
        danger:
          "border-danger/30 bg-[linear-gradient(180deg,rgba(255,241,238,0.96),rgba(255,255,255,0.92))] text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const FIRE_CHARS = [" ", ".", ":", "*", "+", "x", "X"];

function seededNoise(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function createAsciiFrame(
  seed: number,
  frame: number,
  rows: number,
  cols: number,
) {
  const rand = seededNoise(seed + frame * 977);
  const output: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    let line = "";
    for (let col = 0; col < cols; col += 1) {
      const noise = rand();
      const heightBias = row / rows;
      const flicker = ((col + frame) % 5) * 0.035;
      const intensity = noise + heightBias * 1.02 + flicker;

      if (intensity > 1.54) line += FIRE_CHARS[6];
      else if (intensity > 1.38) line += FIRE_CHARS[5];
      else if (intensity > 1.22) line += FIRE_CHARS[4];
      else if (intensity > 1.06) line += FIRE_CHARS[3];
      else if (intensity > 0.92) line += FIRE_CHARS[2];
      else if (intensity > 0.8) line += FIRE_CHARS[1];
      else line += FIRE_CHARS[0];
    }
    output.push(line);
  }

  return output.join("\n");
}

function getToneClasses(variant: "default" | "warning" | "danger") {
  if (variant === "warning") return "text-warning/35";
  if (variant === "danger") return "text-danger/35";
  return "text-accent/35";
}

function Alert({ className, variant, children, ...props }: AlertProps) {
  const resolvedVariant = variant ?? "default";
  const prefersReducedMotion = useReducedMotion();
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setFrame((current) => (current + 1) % 24);
    }, 160);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const asciiFrame = React.useMemo(
    () => createAsciiFrame(resolvedVariant.length * 941 + 17, frame, 10, 22),
    [frame, resolvedVariant],
  );

  return (
    <div
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 hidden w-40 overflow-hidden sm:block",
          getToneClasses(resolvedVariant),
        )}
      >
        <div className="absolute inset-y-0 right-0 w-full font-mono text-[11px] leading-[0.88] tracking-[0.06em]">
          <AnimatePresence mode="wait">
            <motion.pre
              key={frame}
              initial={{ opacity: 0.16 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0.16 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.1,
                ease: "linear",
              }}
              className="absolute right-[-6px] bottom-0 m-0 whitespace-pre [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.35)_22%,black_100%)] text-md"
            >
              {asciiFrame}
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.2))] sm:pr-40">
        {children}
      </div>
    </div>
  );
}

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-base font-semibold tracking-[-0.02em] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-2 text-sm/6 text-muted", className)} {...props} />
  );
}

export { Alert, AlertDescription, AlertTitle };
