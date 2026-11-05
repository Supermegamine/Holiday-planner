import type { Metadata } from "next";
import DemoBanner from "@/app/components/DemoBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Holiday Planner",
  description: "Plan family trips and organise activities together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
