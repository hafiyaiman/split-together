import {
  ParticipantBalance,
  ParticipantDraft,
  SettlementResult,
  SettlementTransfer,
} from "@/lib/types/expense";

function centsToAmount(cents: number) {
  return cents / 100;
}

function parseAmountToCents(amount: string) {
  const normalized = amount.trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.round(parsed * 100);
}

function getDisplayName(participant: ParticipantDraft, index: number) {
  const trimmed = participant.name.trim();
  return trimmed || `Participant ${index + 1}`;
}

export function calculateSettlement(
  participants: ParticipantDraft[]
): SettlementResult {
  const totalCents = participants.reduce(
    (sum, participant) => sum + parseAmountToCents(participant.amount),
    0
  );

  const splitParticipants = participants.filter((participant) => participant.included);
  const splitCount = splitParticipants.length;
  const participantCount = participants.length;
  const share = splitCount === 0 ? 0 : totalCents / splitCount / 100;

  const baseShareCents = splitCount === 0 ? 0 : Math.floor(totalCents / splitCount);
  let remainderCents = splitCount === 0 ? 0 : totalCents % splitCount;

  const balances: ParticipantBalance[] = participants.map((participant, index) => {
    const paidCents = parseAmountToCents(participant.amount);
    const shareCents =
      participant.included && splitCount > 0
        ? baseShareCents + (remainderCents-- > 0 ? 1 : 0)
        : 0;
    const balanceCents = paidCents - shareCents;

    let status: ParticipantBalance["status"] = "settled";

    if (balanceCents > 0) {
      status = "receives";
    } else if (balanceCents < 0) {
      status = "owes";
    }

    return {
      id: participant.id,
      name: getDisplayName(participant, index),
      included: participant.included,
      paid: centsToAmount(paidCents),
      paidCents,
      share: centsToAmount(shareCents),
      shareCents,
      balance: centsToAmount(balanceCents),
      balanceCents,
      status,
    };
  });

  const debtors = balances
    .filter((participant) => participant.balanceCents < 0)
    .map((participant) => ({
      id: participant.id,
      name: participant.name,
      amountCents: Math.abs(participant.balanceCents),
    }))
    .sort((left, right) => right.amountCents - left.amountCents);

  const creditors = balances
    .filter((participant) => participant.balanceCents > 0)
    .map((participant) => ({
      id: participant.id,
      name: participant.name,
      amountCents: participant.balanceCents,
    }))
    .sort((left, right) => right.amountCents - left.amountCents);

  const settlements: SettlementTransfer[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  // Greedy matching settles larger balances first, which keeps the transfer list short.
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountCents = Math.min(debtor.amountCents, creditor.amountCents);

    settlements.push({
      fromId: debtor.id,
      toId: creditor.id,
      fromName: debtor.name,
      toName: creditor.name,
      amount: centsToAmount(amountCents),
      amountCents,
    });

    debtor.amountCents -= amountCents;
    creditor.amountCents -= amountCents;

    if (debtor.amountCents === 0) {
      debtorIndex += 1;
    }

    if (creditor.amountCents === 0) {
      creditorIndex += 1;
    }
  }

  let headline = "Add participants to start calculating.";

  if (participantCount === 0) {
    headline = "Add at least one participant to begin.";
  } else if (splitCount === 0) {
    headline = "Select who is included in the split.";
  } else if (totalCents === 0) {
    headline = "Enter at least one payment amount to see balances.";
  } else if (splitCount === 1) {
    headline = "One participant is in the split, so nothing needs settling.";
  } else if (settlements.length === 0) {
    headline = "Everyone is already balanced.";
  } else {
    headline = `${settlements.length} transfer${
      settlements.length === 1 ? "" : "s"
    } settles this expense.`;
  }

  return {
    total: centsToAmount(totalCents),
    totalCents,
    participantCount,
    splitCount,
    share,
    balances,
    settlements,
    headline,
    isReady: totalCents > 0 && splitCount > 0,
  };
}
