"use client";

import { FlaskConical, Plus, RefreshCcw } from "lucide-react";
import { ParticipantRow } from "@/components/participants/participant-row";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParticipantDraft, ParticipantError } from "@/lib/types/expense";

type ParticipantListProps = {
  participants: ParticipantDraft[];
  errors: Record<string, ParticipantError>;
  hasErrors: boolean;
  onAdd: () => void;
  onLoadSample: () => void;
  onReset: () => void;
  onUpdate: (
    id: string,
    field: keyof ParticipantDraft,
    value: string | boolean,
  ) => void;
  onRemove: (id: string) => void;
};

export function ParticipantList({
  participants,
  errors,
  hasErrors,
  onAdd,
  onLoadSample,
  onReset,
  onUpdate,
  onRemove,
}: ParticipantListProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="neutral">01 //</Badge>
            <CardTitle className="text-2xl">Who paid what</CardTitle>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            Add <span className="font-medium text-primary">names</span> and{" "}
            <span className="font-medium text-primary">paid amounts</span>. Turn
            off <span className="font-medium text-primary">“In split”</span> for
            anyone not sharing the expense.
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0 !py-0">
        <div className="border-b border-black/10">
          <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-black/10">
            <Button
              type="button"
              onClick={onAdd}
              className="h-14 w-full justify-center rounded-none border-0"
            >
              <Plus className="h-4 w-4" />
              Add person
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onLoadSample}
              className="h-14 w-full justify-center rounded-none border-0"
            >
              <FlaskConical className="h-4 w-4" />
              Load sample
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onReset}
              className="h-14 w-full justify-center rounded-none border-0"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="flex flex-1 border-b border-dashed border-black/10 text-center">
            <div className="m-auto px-6 py-12">
              <p className="font-mono text-lg font-semibold tracking-[-0.04em] text-foreground">
                Start with one person
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                Enter a few names and amounts, and the settlement list appears
                on the right.
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="md:max-h-[34rem]">
            <div>
              {participants.map((participant, index) => (
                <ParticipantRow
                  key={participant.id}
                  index={index}
                  participant={participant}
                  errors={errors[participant.id]}
                  canRemove={participants.length > 0}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {hasErrors ? (
          <div className="border-t border-black/10 px-6 py-5">
            <Alert variant="warning">
              <Badge variant="danger" className="w-fit">
                Input //
              </Badge>
              <AlertTitle className="mt-3">Some entries need fixing</AlertTitle>
              <AlertDescription>
                Use a unique name for each person and a valid non-negative
                amount.
              </AlertDescription>
            </Alert>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
