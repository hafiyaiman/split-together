# Splitwise Flow

A production-quality bill split and expense settlement calculator built with Next.js App Router, TypeScript, Tailwind CSS v4, and reusable shadcn-style UI components.

## Features

- Add, edit, remove, and reset participants
- Enter real-world payments instead of a single total
- Optional per-person split toggle for unequal participation
- Live calculation of total spent, participant count, equal share, and balances
- Optimized settlement suggestions showing who should pay whom
- Inline validation for empty names, duplicate names, invalid amounts, and negative values
- Friendly empty states and a one-click sample scenario
- Responsive premium finance-style interface

## Project structure

```text
app/
components/
  participants/
  settlement/
  shared/
  ui/
hooks/
lib/
  calculations/
  constants/
  types/
  utils/
```

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
```

## Sample scenario

- Ali paid `10`
- Ahmad paid `20`
- Hadi paid `90`

Result:

- Total spent: `120`
- Equal share: `40`
- Ali owes `30`
- Ahmad owes `20`
- Hadi receives `50`

Suggested payments:

- Ali -> Hadi `30`
- Ahmad -> Hadi `20`
