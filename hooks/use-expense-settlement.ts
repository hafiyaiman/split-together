"use client";

import { useState } from "react";
import { EMPTY_STATE_PARTICIPANTS, SAMPLE_PARTICIPANTS, createParticipant } from "@/lib/constants/expense";
import { calculateSettlement } from "@/lib/calculations/settlement";
import { ParticipantDraft, ParticipantError } from "@/lib/types/expense";

const amountPattern = /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})?$/;

function cloneParticipants(participants: ParticipantDraft[]) {
  return participants.map((participant) => ({ ...participant }));
}

function getParticipantErrors(
  participants: ParticipantDraft[]
): Record<string, ParticipantError> {
  const duplicateCounts = new Map<string, number>();

  for (const participant of participants) {
    const normalizedName = participant.name.trim().toLowerCase();

    if (normalizedName) {
      duplicateCounts.set(
        normalizedName,
        (duplicateCounts.get(normalizedName) ?? 0) + 1
      );
    }
  }

  return Object.fromEntries(
    participants.map((participant) => {
      const normalizedName = participant.name.trim().toLowerCase();
      const amount = participant.amount.trim();
      const error: ParticipantError = {};

      if (!participant.name.trim()) {
        error.name = "Enter a name.";
      } else if ((duplicateCounts.get(normalizedName) ?? 0) > 1) {
        error.name = "Name must be unique.";
      }

      if (amount.startsWith("-")) {
        error.amount = "Amount cannot be negative.";
      } else if (!amountPattern.test(amount)) {
        error.amount = "Use a valid amount with up to 2 decimals.";
      }

      return [participant.id, error];
    })
  );
}

function hasBlockingErrors(errors: Record<string, ParticipantError>) {
  return Object.values(errors).some((error) => error.name || error.amount);
}

export function useExpenseSettlement() {
  const [participants, setParticipants] = useState<ParticipantDraft[]>(
    cloneParticipants(EMPTY_STATE_PARTICIPANTS)
  );

  const participantErrors = getParticipantErrors(participants);
  const hasErrors = hasBlockingErrors(participantErrors);
  const calculation = calculateSettlement(participants);

  function addParticipant() {
    setParticipants((current) => [...current, createParticipant()]);
  }

  function updateParticipant(
    id: string,
    field: keyof ParticipantDraft,
    value: string | boolean
  ) {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id
          ? { ...participant, [field]: value }
          : participant
      )
    );
  }

  function removeParticipant(id: string) {
    setParticipants((current) =>
      current.filter((participant) => participant.id !== id)
    );
  }

  function loadSampleData() {
    setParticipants(cloneParticipants(SAMPLE_PARTICIPANTS));
  }

  function reset() {
    setParticipants(cloneParticipants(EMPTY_STATE_PARTICIPANTS));
  }

  return {
    participants,
    participantErrors,
    hasErrors,
    calculation,
    addParticipant,
    updateParticipant,
    removeParticipant,
    loadSampleData,
    reset,
  };
}
