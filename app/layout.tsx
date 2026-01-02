import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RyuKimSongMeet - 시간대 맞춤 일정 조율",
  description: "다른 시간대에 있는 친구들과의 쉬운 일정 조율. 자동 시간대 변환으로 최적의 회의 시간을 찾아보세요.",
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
