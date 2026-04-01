"use client";

import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type SettlementNavbarProps = {
  canDownloadPdf: boolean;
  onDownloadPdf: () => void;
};

export function SettlementNavbar({
  canDownloadPdf,
  onDownloadPdf,
}: SettlementNavbarProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/logo/logo-dark.png"
      : "/logo/logo.png";

  return (
    <nav className="section-hover sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-7xl border-x border-border">
        <div className="flex flex-col gap-4 px-6 py-4 flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="neutral" className="sm:block hidden">
              Navbar //
            </Badge>
            <div className="flex items-center gap-2">
              <Image
                src={logoSrc}
                alt="SplitTogether Logo"
                width={32}
                height={32}
                className="rounded-sm"
                suppressHydrationWarning
              />
              <p className="font-mono text-lg font-semibold tracking-[-0.04em] text-foreground">
                SplitTogether
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 items-end">
            <Button
              type="button"
              variant="secondary"
              disabled={!canDownloadPdf}
              onClick={onDownloadPdf}
              className="rounded-none"
            >
              <FileDown className="h-4 w-4" />
              <span className="sm:block hidden">Download PDF</span>
            </Button>
            <p className="text-xs leading-5 text-muted sm:text-right sm:block hidden">
              {canDownloadPdf
                ? "Share the current payment plan with everyone."
                : "Add valid participant details to enable PDF export."}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
