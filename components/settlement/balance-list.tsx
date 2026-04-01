import { ArrowDownLeft, ArrowUpRight, Equal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantBalance } from "@/lib/types/expense";
import { formatAmount, formatSignedAmount } from "@/lib/utils/format";

type BalanceListProps = {
  balances: ParticipantBalance[];
};

export function BalanceList({ balances }: BalanceListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-3">
        <div className="px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="neutral">04 //</Badge>
            <CardTitle className="text-2xl">Balances</CardTitle>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            Positive balances should receive money. Negative balances still owe their share.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {balances.length === 0 ? (
          <div className="px-6 py-5">
            <p className="text-sm text-muted">Add participants to see individual balances.</p>
          </div>
        ) : (
          <div className="border-t border-black/10 divide-y divide-black/10">
            {balances.map((participant) => (
              <div key={participant.id}>
                <div className="grid sm:grid-cols-[minmax(0,1fr)_12rem] sm:divide-x sm:divide-black/10">
                  <div className="px-6 py-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-foreground">{participant.name}</p>
                        <Badge
                          variant={
                            participant.status === "owes"
                              ? "danger"
                              : participant.status === "receives"
                                ? "success"
                                : "neutral"
                          }
                        >
                          {participant.status === "owes"
                            ? "Owes"
                            : participant.status === "receives"
                              ? "Receives"
                              : "Settled"}
                        </Badge>
                        {!participant.included ? <Badge variant="neutral">Not in split</Badge> : null}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted">
                        <span>Paid {formatAmount(participant.paid)}</span>
                        <span>Share {formatAmount(participant.share)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end px-6 py-5">
                    <div className="flex items-center gap-3 font-mono text-lg font-semibold">
                      {participant.status === "owes" ? (
                        <ArrowUpRight className="h-4 w-4 text-danger" />
                      ) : participant.status === "receives" ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : (
                        <Equal className="h-4 w-4 text-muted" />
                      )}
                      <span
                        className={
                          participant.status === "owes"
                            ? "text-danger"
                            : participant.status === "receives"
                              ? "text-success"
                              : "text-foreground"
                        }
                      >
                        {formatSignedAmount(participant.balance)}
                      </span>
                    </div>
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
