"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ParticipantDraft, ParticipantError } from "@/lib/types/expense";
import { cn } from "@/lib/utils/cn";

type ParticipantRowProps = {
  index: number;
  participant: ParticipantDraft;
  errors?: ParticipantError;
  canRemove: boolean;
  onUpdate: (
    id: string,
    field: keyof ParticipantDraft,
    value: string | boolean,
  ) => void;
  onRemove: (id: string) => void;
};

export function ParticipantRow({
  index,
  participant,
  errors,
  canRemove,
  onUpdate,
  onRemove,
}: ParticipantRowProps) {
  return (
    <div className="group">
      <div className="grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:divide-x sm:divide-black/10">
        <div className="border-b border-black/10">
          <div className="flex h-full flex-col justify-between px-6 py-5">
            {/* <div className="flex items-center justify-between gap-3"> */}
            {/* <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted transition-colors duration-150 group-hover:text-foreground">
                Person {index + 1}
              </span> */}
            {/* <label
                className="flex cursor-pointer items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.14em] text-foreground transition-opacity duration-150 hover:opacity-80"
                htmlFor={`included-${participant.id}`}
              >
                <input
                  id={`included-${participant.id}`}
                  type="checkbox"
                  checked={participant.included}
                  onChange={(event) =>
                    onUpdate(participant.id, "included", event.target.checked)
                  }
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                In split
              </label> */}
            {/* </div> */}

            <div className="">
              <div className="flex justify-between items-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/35">
                  Name
                </p>
                <label
                  className="flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-opacity duration-150 hover:opacity-80"
                  htmlFor={`included-${participant.id}`}
                >
                  <input
                    id={`included-${participant.id}`}
                    type="checkbox"
                    checked={participant.included}
                    onChange={(event) =>
                      onUpdate(participant.id, "included", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  In split
                </label>
              </div>

              <Input
                id={`name-${participant.id}`}
                value={participant.name}
                onChange={(event) =>
                  onUpdate(participant.id, "name", event.target.value)
                }
                placeholder={`Person ${index + 1}`}
                aria-label={`Participant ${index + 1} name`}
                aria-invalid={Boolean(errors?.name)}
                className={cn(errors?.name && "border-red-300")}
              />
              <div className="min-h-4">
                {errors?.name ? (
                  <p className="text-xs font-medium text-danger">
                    {errors.name}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="grid border-b border-black/10 grid-cols-[minmax(0,1fr)_3.5rem]">
          <div className="border-r border-black/10">
            <div className="flex h-full flex-col justify-between gap-5 px-6 py-5">
              <div className="">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/35">
                  Amount paid
                </p>
                <Input
                  id={`amount-${participant.id}`}
                  inputMode="decimal"
                  value={participant.amount}
                  onChange={(event) =>
                    onUpdate(participant.id, "amount", event.target.value)
                  }
                  placeholder="0.00"
                  aria-label={`Participant ${index + 1} amount paid`}
                  aria-invalid={Boolean(errors?.amount)}
                  className={cn(
                    "font-mono",
                    errors?.amount && "border-red-300",
                  )}
                />
                <div className="min-h-4">
                  {errors?.amount ? (
                    <p className="text-xs font-medium text-danger">
                      {errors.amount}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => onRemove(participant.id)}
              disabled={!canRemove}
              aria-label={`Remove participant ${index + 1}`}
              className="h-full w-full rounded-none border-0 opacity-70 transition-all duration-150 group-hover:bg-white/20 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
