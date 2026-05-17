import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curious Bob",
  description: "AI-powered repository analysis that generates actionable engineering tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}