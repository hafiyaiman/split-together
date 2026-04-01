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
        <div className="flex flex-col items-end justify-between gap-1">
          <p className="font-mono text-3xl font-semibold tracking-[-0.05em] text-foreground">
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
