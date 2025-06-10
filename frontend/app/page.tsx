"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Brain,
  MessageCircle,
  Sparkles,
  TrendingUp,
  ExternalLink,
  User,
  Github,
  Linkedin,
  Zap,
  Clock,
} from "lucide-react";

interface SentimentResult {
  text: string;
  prediction: string;
  model: string;
}

const models = [
  {
    value: "logistic_regression",
    label: "Logistic Regression",
    type: "traditional",
  },
  { value: "naive_bayes", label: "Naive Bayes", type: "traditional" },
  { value: "svm", label: "Support Vector Machine", type: "traditional" },
  { value: "random_forest", label: "Random Forest", type: "traditional" },
];

const exampleTexts = [
  {
    text: "This product is amazing! Works perfectly and exceeded my expectations.",
    sentiment: "positive",
  },
  {
    text: "Terrible service, very disappointed with the quality.",
    sentiment: "negative",
  },
  {
    text: "The movie was okay, nothing special but not bad.",
    sentiment: "negative",
  },
  {
    text: "Excellent restaurant! Food was delicious and service was great.",
    sentiment: "positive",
  },
  {
    text: "Frustrated with the support team. They were unhelpful.",
    sentiment: "negative",
  },
];

const deepLearningModels = [
  {
    label: "BERT (Transformer)",
    description: "State-of-the-art language understanding",
  },
  { label: "RoBERTa", description: "Robustly optimized BERT approach" },
  { label: "DistilBERT", description: "Lightweight BERT variant" },
  {
    label: "LSTM Neural Network",
    description: "Sequential pattern recognition",
  },
];

const getSentimentEmoji = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "😊";
    case "negative":
      return "😞";
    default:
      return "🤔";
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "bg-green-100 text-green-800 border-green-200";
    case "negative":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

const styles = `
  @keyframes highlight {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.2); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }

  .highlight-section {
    animation: highlight 2s ease-out;
  }

  @keyframes pulse-hint {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .pulse-hint {
    animation: pulse-hint 2s ease-in-out;
  }

  @keyframes bounce-arrow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(3px); }
  }

  .bounce-arrow {
    animation: bounce-arrow 1.5s ease-in-out infinite;
  }

  @keyframes glow-border {
    0% { border-color: rgba(147, 51, 234, 0.3); }
    50% { border-color: rgba(147, 51, 234, 0.8); }
    100% { border-color: rgba(147, 51, 234, 0.3); }
  }

  .glow-border {
    animation: glow-border 2s ease-in-out infinite;
  }
`;

const StyleSheet = () => (
  <style jsx global>
    {styles}
  </style>
);

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState("");
  const [showModelHint, setShowModelHint] = useState(false);

  const handleExampleClick = (exampleText: string) => {
    setText(exampleText);
    setResult(null);
    setError("");
    setShowModelHint(true);
    // Scroll back to top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Hide the hint after 5 seconds
    setTimeout(() => {
      setShowModelHint(false);
    }, 5000);
  };

  const scrollToExamples = () => {
    const examplesSection = document.getElementById("examples-section");
    if (examplesSection) {
      examplesSection.scrollIntoView({ behavior: "smooth" });
      // Add a highlight effect
      examplesSection.classList.add("highlight-section");
      setTimeout(() => {
        examplesSection.classList.remove("highlight-section");
      }, 2000);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim() || !selectedModel) {
      setError("Please enter text and select a model");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:3000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      setResult({
        text: text.trim(),
        prediction: data.prediction || "Unknown",
        model: selectedModel,
      });
    } catch (err) {
      setError(
        "Failed to analyze sentiment. Please check your connection and try again."
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setSelectedModel("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <StyleSheet />
      {/* Header with Logo and Navigation */}
      <header className="w-full border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SentimentAI</h1>
                <p className="text-xs text-gray-500">Advanced Text Analysis</p>
              </div>
            </motion.div>

            {/* Portfolio Link */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="group hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                onClick={() => window.open("https://ataie.me/", "_blank")}
              >
                <User className="w-4 h-4 mr-2 group-hover:text-blue-600 transition-colors" />
                <span className="group-hover:text-blue-600 transition-colors">
                  Portfolio
                </span>
                <ExternalLink className="w-3 h-3 ml-1 group-hover:text-blue-600 transition-colors" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg">
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Sentiment Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze the emotional tone of any text using advanced machine
            learning
          </p>
        </motion.div>

        {/* Main Analysis Card - More Prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                Analyze Text Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {/* Text Input - More Prominent */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="text-input"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Text to Analyze
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={scrollToExamples}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Try Examples
                  </Button>
                </div>
                <Textarea
                  id="text-input"
                  placeholder="Enter your text here to analyze its sentiment..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[160px] resize-none text-base leading-relaxed border-2 focus:border-blue-300 transition-all duration-300 rounded-xl"
                  disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{text.length} characters</span>
                  <span>
                    {
                      text
                        .trim()
                        .split(/\s+/)
                        .filter((word) => word.length > 0).length
                    }{" "}
                    words
                  </span>
                </div>
              </div>

              {/* Model Selection - Enhanced */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1">
                    <Select
                      value={selectedModel}
                      onValueChange={(value) => {
                        setSelectedModel(value);
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        className={`text-base h-12 border-2 focus:border-purple-300 transition-all duration-300 rounded-xl relative ${
                          showModelHint
                            ? "pulse-hint glow-border border-purple-300 bg-purple-50/50"
                            : "hover:border-purple-200 hover:bg-purple-50/30"
                        }`}
                      >
                        <SelectValue placeholder="Choose an AI model for analysis" />
                        {showModelHint && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 text-purple-500 bounce-arrow">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem
                            key={model.value}
                            value={model.value}
                            className="text-base py-3 hover:bg-purple-50"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                              {model.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showModelHint && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-8 left-0 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md"
                      >
                        Click to select a model
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50/80 px-3 py-1.5 rounded-lg ml-4 border border-purple-100">
                    <Brain className="w-4 h-4" />
                    Choose a model to analyze
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons - More Prominent */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading || !text.trim() || !selectedModel}
                  className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Sentiment
                    </>
                  )}
                </Button>
                {(text || selectedModel || result) && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={isLoading}
                    className="px-8 h-14 text-base border-2 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Supporting Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example Texts - Secondary Position */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full"
            id="examples-section"
          >
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm h-full transition-all duration-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Try Example Texts
                </CardTitle>
                <CardDescription>
                  Click on any example to quickly test the analyzer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exampleTexts.map((example, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleExampleClick(example.text)}
                      className="w-full p-3 text-left bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 rounded-lg border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 group"
                    >
                      <p className="text-sm text-gray-700 group-hover:text-gray-900">
                        {example.text}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getSentimentColor(
                            example.sentiment
                          )}`}
                        >
                          {example.sentiment.charAt(0).toUpperCase() +
                            example.sentiment.slice(1)}
                        </Badge>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Deep Learning Models - Secondary Position */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-full"
          >
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Coming Soon
                </CardTitle>
                <CardDescription>
                  Advanced deep learning models for even better analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deepLearningModels.map((model, index) => (
                    <motion.div
                      key={model.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100"
                    >
                      <p className="font-medium text-gray-800 text-sm">
                        {model.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {model.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Results Section - More Prominent */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
                <CardHeader className="pb-6 bg-gradient-to-r from-green-50/50 to-blue-50/50">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  {/* Sentiment Result - Most Prominent */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <Badge
                        variant="secondary"
                        className={`px-8 py-4 text-2xl font-bold ${getSentimentColor(
                          result.prediction
                        )} border-2 rounded-xl shadow-lg`}
                      >
                        <span className="mr-3 text-3xl">
                          {getSentimentEmoji(result.prediction)}
                        </span>
                        {result.prediction.charAt(0).toUpperCase() +
                          result.prediction.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Original Text */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      Analyzed Text
                    </Label>
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100">
                      <p className="text-gray-800 leading-relaxed text-lg">
                        "{result.text}"
                      </p>
                    </div>
                  </div>

                  {/* Model Used */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      AI Model Used
                    </Label>
                    <Badge
                      variant="outline"
                      className="text-base px-4 py-2 border-2 rounded-xl"
                    >
                      <Brain className="w-4 h-4 mr-2 text-blue-600" />
                      {models.find((m) => m.value === result.model)?.label ||
                        result.model}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer - Simplified */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 pb-8"
        >
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Powered by advanced machine learning algorithms
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>Built with Next.js & Tailwind CSS</span>
              <span>•</span>
              <a
                href="https://ataie.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors duration-300 flex items-center gap-1"
              >
                Created by Ataie
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
