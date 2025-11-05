import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers"

export const metadata: Metadata = {
  title: "TeamFlow Pro",
  description: "Modern task management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}