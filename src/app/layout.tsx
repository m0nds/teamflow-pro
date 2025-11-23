import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers"
import { ClerkProvider } from "@clerk/nextjs";

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
        <ClerkProvider>
          <AppProviders>
            {children}
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}