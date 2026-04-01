export type BalanceStatus = "owes" | "receives" | "settled";

export type ParticipantDraft = {
  id: string;
  name: string;
  amount: string;
  included: boolean;
};

export type ParticipantError = {
  name?: string;
  amount?: string;
};

export type ParticipantBalance = {
  id: string;
  name: string;
  included: boolean;
  paid: number;
  paidCents: number;
  share: number;
  shareCents: number;
  balance: number;
  balanceCents: number;
  status: BalanceStatus;
};

export type SettlementTransfer = {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  amount: number;
  amountCents: number;
};

export type SettlementResult = {
  total: number;
  totalCents: number;
  participantCount: number;
  splitCount: number;
  share: number;
  balances: ParticipantBalance[];
  settlements: SettlementTransfer[];
  headline: string;
  isReady: boolean;
};
