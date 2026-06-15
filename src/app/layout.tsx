import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import PrepifyLoader from "@/components/PrepifyLoader";

export const metadata: Metadata = {
  title: {
    default: "Prepify — Interactive Quiz & Exam Review",
    template: "%s | Prepify",
  },
  description: "Interactive Quiz & Exam Review Platform — Practice Cyber Security, C Programming, and more with instant feedback and progress tracking.",
  keywords: ["quiz", "exam", "review", "cyber security", "C programming", "education", "prepify"],
  authors: [{ name: "Mahmoud ABD ELKream" }],
  creator: "Mahmoud ABD ELKream",
  metadataBase: new URL("https://prepify.space-z.ai"),
  openGraph: {
    title: "Prepify — Interactive Quiz & Exam Review",
    description: "Practice Cyber Security, C Programming, and more with instant feedback and progress tracking.",
    type: "website",
    locale: "en_US",
  },
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-md">
          Skip to main content
        </a>
        <PrepifyLoader>{children}</PrepifyLoader>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
