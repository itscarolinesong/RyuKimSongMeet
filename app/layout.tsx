import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "류김송의 만남을 위한 웹사이트",
  description: "지구 반대편에 있는 친구들과의 쉬운 일정 조율. 자동 시간대 변환으로 최적의 회의 시간을 찾아보세요~",
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
