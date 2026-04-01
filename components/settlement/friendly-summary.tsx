import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantBalance } from "@/lib/types/expense";
import { formatAmount } from "@/lib/utils/format";

type FriendlySummaryProps = {
  share: number;
  balances: ParticipantBalance[];
  hasErrors: boolean;
};

export function FriendlySummary({
  share,
  balances,
  hasErrors,
}: FriendlySummaryProps) {
  const activeBalances = balances.filter((participant) => participant.balance !== 0);

  return (
    <Card className="h-full">
      <CardHeader className="gap-3">
        <div className="px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="neutral">03 //</Badge>
            <CardTitle className="text-2xl">Simple summary</CardTitle>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            A quick breakdown in case someone asks why they need to pay.
          </p>
        </div>
      </CardHeader>
      <CardContent className="gap-0 p-0">
        <div className="border-y border-border bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent-soft)_24%,transparent),color-mix(in_oklab,var(--card)_20%,transparent))]">
          <div className="grid sm:grid-cols-[minmax(0,1fr)_12rem] sm:divide-x sm:divide-border">
            <div className="px-6 py-5">
              <p className="text-sm text-muted">Each included person should pay</p>
            </div>
            <div className="flex items-center justify-end px-6 py-5">
              <p className="max-w-full text-right font-mono text-2xl font-semibold tracking-tight text-accent [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere] sm:text-3xl">
                {formatAmount(share)}
              </p>
            </div>
          </div>
        </div>

        {activeBalances.length === 0 ? (
          <div className="px-6 py-5">
            <Alert variant={hasErrors ? "warning" : "default"}>
              <Badge
                variant={hasErrors ? "danger" : "accent"}
                className="w-fit"
              >
                {hasErrors ? "Review //" : "Settled //"}
              </Badge>
              <AlertTitle className="mt-3 flex items-center gap-2">
                <CircleAlert className="h-4 w-4" />
                {hasErrors ? "Validation needed" : "All settled"}
              </AlertTitle>
              <AlertDescription>
                {hasErrors
                  ? "Correct the inputs to generate the summary."
                  : "No outstanding balance remains."}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activeBalances.map((participant) => (
              <div key={participant.id}>
                <div className="grid sm:grid-cols-[minmax(0,1fr)_12rem] sm:divide-x sm:divide-border">
                  <div className="px-6 py-5">
                    <p className="font-medium text-foreground">{participant.name}</p>
                  </div>
                  <div className="flex items-center justify-end px-6 py-5">
                    <p
                      className={`max-w-full text-right font-mono text-base font-semibold [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere] sm:text-lg ${
                        participant.balance > 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {participant.balance > 0 ? "Gets " : "Owes "}
                      {formatAmount(Math.abs(participant.balance))}
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
