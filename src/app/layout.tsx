import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import {twMerge}  from "tailwind-merge";
import "./global.css";

// import clsx from "clsx";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lapwork ",
  description: "real Productivity Buddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <body className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        {children}
      </body>
    </html>
  );
}
