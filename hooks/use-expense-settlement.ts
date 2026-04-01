"use client";

import { useEffect, useRef, useState } from "react";
import { EMPTY_STATE_PARTICIPANTS, SAMPLE_PARTICIPANTS, createParticipant } from "@/lib/constants/expense";
import { calculateSettlement } from "@/lib/calculations/settlement";
import { ParticipantDraft, ParticipantError } from "@/lib/types/expense";

const amountPattern = /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})?$/;
const STORAGE_KEY = "split-together:participants:v1";

function cloneParticipants(participants: ParticipantDraft[]) {
  return participants.map((participant) => ({ ...participant }));
}

function isStoredParticipantDraft(value: unknown): value is ParticipantDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.amount === "string" &&
    typeof candidate.included === "boolean"
  );
}

function readStoredParticipants() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return null;
    }

    const participants = parsedValue.filter(isStoredParticipantDraft);

    if (participants.length !== parsedValue.length) {
      return null;
    }

    return cloneParticipants(participants);
  } catch {
    return null;
  }
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
  const hasHydratedStorage = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      const storedParticipants = readStoredParticipants();

      hasHydratedStorage.current = true;

      if (storedParticipants) {
        setParticipants(storedParticipants);
      }
    });
  }, []);

  useEffect(() => {
    if (!hasHydratedStorage.current || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  }, [participants]);

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
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }

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
