import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sentiment Analyzer | Advanced Text Analysis Tool",
  description:
    "Analyze the emotional tone of your text with our AI-powered sentiment analysis tool. Get instant insights using advanced machine learning models including Logistic Regression, Naive Bayes, SVM, and Random Forest.",
  keywords:
    "sentiment analysis, AI, machine learning, text analysis, natural language processing, emotion detection, text sentiment, ML models",
  authors: [{ name: "Ataie", url: "https://ataie.me/" }],
  creator: "Ataie",
  publisher: "Ataie",
  robots: "index, follow",
  openGraph: {
    title: "AI Sentiment Analyzer | Advanced Text Analysis Tool",
    description:
      "Analyze the emotional tone of your text with our AI-powered sentiment analysis tool. Get instant insights using advanced machine learning models.",
    url: "https://sentiment-analyzer.ataie.me",
    siteName: "AI Sentiment Analyzer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Sentiment Analyzer - Advanced Text Analysis Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Sentiment Analyzer | Advanced Text Analysis Tool",
    description:
      "Analyze the emotional tone of your text with our AI-powered sentiment analysis tool.",
    images: ["/og-image.png"],
    creator: "@ataie",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#2563eb",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://sentiment-analyzer.ataie.me" />
        <meta
          name="google-site-verification"
          content="your-google-verification-code"
        />
      </head>
      <body style={{ fontFamily: "Inter, sans-serif" }}>{children}</body>
    </html>
  );
}
