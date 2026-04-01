import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SplitTogether - Bill Splitting and Expense Settlement Calculator",
  description:
    "SplitTogether is a bill splitting and expense settlement calculator that shows each person's share, highlights balances, and generates the clearest payment plan so you know exactly who owes whom.",
  applicationName: "SplitTogether",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SplitTogether",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-background">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
