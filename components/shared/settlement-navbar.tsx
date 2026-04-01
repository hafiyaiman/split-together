"use client";

import { Download } from "lucide-react";
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
  return (
    <nav className="section-hover sticky top-0 z-30 border-b border-black/10 bg-background">
      <div className="mx-auto w-full max-w-7xl border-x border-black/10">
        <div className="flex flex-col gap-4 px-6 py-4 flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="neutral" className="sm:block hidden">
              Navbar //
            </Badge>
            <div className="flex items-center gap-2">
              <Image
                src="/logo/logo.png"
                alt="SplitTogether Logo"
                width={32}
                height={32}
                className="rounded-sm"
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
              <Download className="h-4 w-4" />
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
