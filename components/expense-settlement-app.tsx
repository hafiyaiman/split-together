"use client";

import { ParticipantList } from "@/components/participants/participant-list";
import { FloatingThemeToggle } from "@/components/shared/floating-theme-toggle";
import { SettlementNavbar } from "@/components/shared/settlement-navbar";
import { SummaryCard } from "@/components/shared/summary-card";
import { BalanceList } from "@/components/settlement/balance-list";
import { FriendlySummary } from "@/components/settlement/friendly-summary";
import { SettlementList } from "@/components/settlement/settlement-list";
import { Badge } from "@/components/ui/badge";
import { useExpenseSettlement } from "@/hooks/use-expense-settlement";
import { formatAmount } from "@/lib/utils/format";
import { exportSettlementPdf } from "@/lib/utils/pdf";
import Link from "next/link";

function VerticalRail({ label }: { label: string }) {
  return (
    <div className="absolute top-0 right-full hidden h-full w-20 xl:flex xl:flex-col xl:border-l xl:border-border">
      <div className="editor-rail h-24 border-b border-border" />
      <div className="flex flex-1 items-center justify-center">
        <span className="rotate-180 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff1493] [writing-mode:vertical-rl]">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function ExpenseSettlementApp() {
  const {
    participants,
    participantErrors,
    hasErrors,
    calculation,
    addParticipant,
    updateParticipant,
    removeParticipant,
    loadSampleData,
    reset,
  } = useExpenseSettlement();
  const canDownloadPdf =
    participants.length > 0 && !hasErrors && calculation.splitCount > 0;

  return (
    <>
      <SettlementNavbar
        canDownloadPdf={canDownloadPdf}
        onDownloadPdf={() =>
          exportSettlementPdf({
            balances: calculation.balances,
            headline: calculation.headline,
            share: calculation.share,
            splitCount: calculation.splitCount,
            settlements: calculation.settlements,
            total: calculation.total,
          })
        }
      />

      <main className="mx-auto min-h-screen w-full px-0 py-0">
        <div className="relative mx-auto min-h-screen w-full max-w-7xl">
          <VerticalRail label="Ready-made settlements" />

          <div className="w-full">
            <div className="border-x border-border divide-y divide-border">
              <section className="section-hover">
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] lg:divide-x lg:divide-border">
                  <div className="flex h-full">
                    <div className="flex min-h-[26rem] w-full flex-col justify-between px-6 py-6">
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="accent">Settlement //</Badge>
                          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                            Real-world bill split
                          </span>
                        </div>
                        <div className="space-y-4">
                          <p className="font-mono text-xs tracking-[0.12em] text-muted/45">
                            text-4xl tracking-tighter text-balance
                          </p>
                          <h1 className="max-w-4xl font-sans text-5xl font-semibold leading-[0.95] tracking-[-0.08em] text-foreground sm:text-6xl lg:text-7xl">
                            Know exactly
                            <br />
                            who pays whom
                          </h1>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="font-mono text-xs tracking-[0.12em] text-muted/45">
                          text-base text-gray-950
                        </p>
                        <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
                          Enter what everyone paid. The app calculates the equal
                          share, highlights balances, and gives you the shortest
                          clean payment list.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full">
                    <div className="flex sm:min-h-[26rem] w-full flex-col bg-card/35 transition-colors duration-150 hover:bg-card/60">
                      <div className="border-b border-border px-6 py-5">
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                          Result.preview
                        </span>
                      </div>

                      <div className="grid flex-1 divide-y divide-border grid-cols-3 divide-x divide-y-0">
                        <SummaryCard
                          label="Total"
                          value={formatAmount(calculation.total)}
                          detail="All payments"
                        />
                        <SummaryCard
                          label="People"
                          value={`${calculation.splitCount}`}
                          detail="In this split"
                        />
                        <SummaryCard
                          label="Share"
                          value={formatAmount(calculation.share)}
                          detail="Per person"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="lg:grid lg:grid-cols-2">
                <div className="section-hover border-b border-border lg:border-r">
                  <ParticipantList
                    participants={participants}
                    errors={participantErrors}
                    hasErrors={hasErrors}
                    onAdd={addParticipant}
                    onLoadSample={loadSampleData}
                    onReset={reset}
                    onUpdate={updateParticipant}
                    onRemove={removeParticipant}
                  />
                </div>

                <div className="section-hover border-b border-border">
                  <SettlementList
                    settlements={calculation.settlements}
                    headline={calculation.headline}
                    isDisabled={hasErrors}
                  />
                </div>

                <div className="section-hover border-b border-border lg:border-b-0 lg:border-r">
                  <FriendlySummary
                    share={calculation.share}
                    balances={calculation.balances}
                    hasErrors={hasErrors}
                  />
                </div>

                <div className="section-hover">
                  <BalanceList balances={calculation.balances} />
                </div>
              </section>

              <footer className="section-hover flex justify-between items-center">
                <div className="px-6 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                    © 2026 SplitTogether. All rights reserved.
                  </p>
                </div>

                <div className="flex gap-1 sm:pr-4 pr-2">
                  <Link href="https://github.com/hafiyaiman">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                      [Github]
                    </p>
                  </Link>

                  <Link href="https://www.linkedin.com/in/hafiy-aiman-husain/">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                      [LinkedIn]
                    </p>
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </main>

      <FloatingThemeToggle />
    </>
  );
}
