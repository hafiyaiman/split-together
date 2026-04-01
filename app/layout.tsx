import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("h-full antialiased bg-background", "font-sans", geist.variable)}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
