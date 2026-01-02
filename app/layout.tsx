import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RyuKimSongMeet - Timezone-Aware Meeting Scheduler",
  description: "Easy scheduling tool for friend groups across different time zones. Find optimal meeting times with automatic timezone conversion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
