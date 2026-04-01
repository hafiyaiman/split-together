"use client";

import { FloatingPwaInstallButton } from "@/components/shared/floating-pwa-install-button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function FloatingThemeToggle() {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <FloatingPwaInstallButton />
      <AnimatedThemeToggler className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-md transition-colors hover:bg-card" />
    </div>
  );
}
