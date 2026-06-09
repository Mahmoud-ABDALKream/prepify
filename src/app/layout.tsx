import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Prepify — Mahmoud ABD ELKream",
  description: "Interactive Quiz & Review Platform by Mahmoud ABD ELKream",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className="dark" style={{ backgroundColor: '#080c18' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Cairo:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground" style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: '#080c18', margin: 0, padding: 0 }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
