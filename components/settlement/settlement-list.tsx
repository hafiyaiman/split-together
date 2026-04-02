import { ArrowRight, ArrowRightLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettlementTransfer } from "@/lib/types/expense";
import { formatAmount } from "@/lib/utils/format";

type SettlementListProps = {
  settlements: SettlementTransfer[];
  headline: string;
  isDisabled?: boolean;
};

export function SettlementList({
  settlements,
  headline,
  isDisabled,
}: SettlementListProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent">02 //</Badge>
            <CardTitle className="text-2xl">Who should pay whom</CardTitle>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            The output is intentionally simple: follow these payments and the
            bill is settled.
          </p>
        </div>
      </CardHeader>
      <CardContent className="gap-0 p-0">
        <div className="px-6 py-5">
          <Alert variant={isDisabled ? "warning" : "default"}>
            <Badge variant={isDisabled ? "danger" : "accent"} className="w-fit">
              {isDisabled ? "Action //" : "Ready //"}
            </Badge>
            <AlertTitle className="mt-3">{headline}</AlertTitle>
            <AlertDescription>
              {isDisabled
                ? "Fix the highlighted input issues first."
                : "Ordered from top to bottom for quick settlement."}
            </AlertDescription>
          </Alert>
        </div>

        {/* {firstSettlement && !isDisabled ? (
          <div className="border-y border-border bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent-soft)_32%,transparent),color-mix(in_oklab,var(--card)_28%,transparent))]">
            <div className="grid sm:grid-cols-[minmax(0,1fr)_14rem] sm:divide-x sm:divide-border">
              <div className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <Badge variant="accent">Primary //</Badge>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                    Next payment
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-lg font-semibold text-foreground">
                  <span>{firstSettlement.fromName}</span>
                  <ArrowRight className="h-5 w-5 text-accent" />
                  <span>{firstSettlement.toName}</span>
                </div>
              </div>
              <div className="flex items-center justify-end px-6 py-5">
                <p className="font-mono text-3xl font-semibold tracking-[-0.05em] text-accent">
                  {formatAmount(firstSettlement.amount)}
                </p>
              </div>
            </div>
          </div>
        ) : null} */}

        {settlements.length === 0 || isDisabled ? (
          <div className="border-t border-dashed border-border py-10 text-center">
            <div className="px-6">
              <ArrowRightLeft className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 font-medium text-foreground">
                No payment instructions yet
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Add valid entries and the app will tell you exactly who pays
                whom.
              </p>
            </div>
          </div>
        ) : (
          <div className="border-t border-border divide-y divide-border">
            {settlements.map((settlement, index) => (
              <div
                key={`${settlement.fromId}-${settlement.toId}-${index}`}
                className={
                  index === settlements.length - 1
                    ? "border-b border-border"
                    : undefined
                }
              >
                <div className="grid sm:grid-cols-[minmax(0,1fr)_12rem] sm:divide-x sm:divide-border">
                  <div className="px-6 py-5">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                      Payment {index + 1}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <Badge variant="danger">{settlement.fromName}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted" />
                      <Badge variant="success">{settlement.toName}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-end px-6 py-5">
                    <p className="max-w-full text-right font-mono text-xl font-semibold tracking-[-0.05em] text-foreground [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere] sm:text-2xl">
                      {formatAmount(settlement.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
