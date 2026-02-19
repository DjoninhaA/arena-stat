import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arena Stat",
  description: "Arena Stat",
  icons: {
    icon: '/logo-arena.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
