type SummaryCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function SummaryCard({ label, value, detail }: SummaryCardProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col justify-between gap-5 p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
        <div className="flex w-full flex-col items-end justify-between gap-1">
          <p className="max-w-full text-right font-mono text-2xl font-semibold tracking-[-0.05em] text-foreground [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere] sm:text-3xl">
            {value}
          </p>
          <p className="max-w-28 text-right text-xs leading-5 text-muted">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}
