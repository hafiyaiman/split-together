import { ParticipantDraft } from "@/lib/types/expense";

export const SAMPLE_PARTICIPANTS: ParticipantDraft[] = [
  { id: "ali", name: "Ali", amount: "10", included: true },
  { id: "ahmad", name: "Ahmad", amount: "20", included: true },
  { id: "hadi", name: "Hadi", amount: "90", included: true },
];

export const EMPTY_STATE_PARTICIPANTS: ParticipantDraft[] = [];

function createParticipantId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `participant-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createParticipant(): ParticipantDraft {
  return {
    id: createParticipantId(),
    name: "",
    amount: "",
    included: true,
  };
}
