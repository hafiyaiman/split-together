import type { Metadata } from "next";
import Script from "next/script";
import ExpenseSettlementApp from "@/components/expense-settlement-app";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Bill Split Calculator and Expense Settlement Tool",
  description:
    "Use SplitTogether to split shared expenses, calculate each person's share, and see exactly who owes whom with a clean payment plan.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Bill Split Calculator and Expense Settlement Tool`,
    description:
      "Split bills online, calculate balances, and settle group expenses with a clear who-owes-whom payment list.",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Bill Split Calculator and Expense Settlement Tool`,
    description:
      "Split bills online, calculate balances, and settle group expenses with a clear who-owes-whom payment list.",
    images: [OG_IMAGE],
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern web browser.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ExpenseSettlementApp />
    </>
  );
}
