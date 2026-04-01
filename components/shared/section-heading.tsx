import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? <Badge variant="accent" className="w-fit">{eyebrow}</Badge> : null}
      <div className="space-y-2">
        <h2 className="font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
