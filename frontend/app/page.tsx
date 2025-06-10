import { Metadata } from "next";

import GlobalStyles from "./components/GlobalStyles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SentimentAnalyzer from "./components/SentimentAnalyzer";

export const metadata: Metadata = {
  title: "Sentiment Analyzer",
  description: "Analyze the sentiment of any text using advanced AI models",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GlobalStyles />
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Hero />
        <SentimentAnalyzer />
        <Footer />
      </div>
    </div>
  );
}
