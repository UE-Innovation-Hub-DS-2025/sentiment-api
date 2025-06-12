"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Loader2, Brain, MessageCircle, Sparkles } from "lucide-react";
import LoadingState from "./LoadingState";
import ResultsSection from "./ResultsSection";
import ExamplesSection from "./ExamplesSection";

// Sentiment analysis models
const models = [
  {
    value: "logistic_regression",
    label: "Logistic Regression",
  },
  {
    value: "naive_bayes",
    label: "Naive Bayes",
  },
  {
    value: "svm",
    label: "Support Vector Machine",
  },
  {
    value: "random_forest",
    label: "Random Forest",
  },
];

// Deep learning models (coming soon)
const deepLearningModels = [
  {
    label: "BERT",
    description: "Bidirectional Encoder Representations from Transformers",
  },
  {
    label: "RoBERTa",
    description: "Robustly Optimized BERT Pretraining Approach",
  },
  {
    label: "XLNet",
    description:
      "Generalized Autoregressive Pretraining for Language Understanding",
  },
];

interface SentimentResult {
  text: string;
  prediction: string;
  model: string;
  confidence: number;
  confidence_text: string;
}

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      setShowModelHint(false);
    }, 5000);
  };

  const scrollToExamples = () => {
    const examplesSection = document.getElementById("examples-section");
    if (examplesSection) {
      examplesSection.scrollIntoView({ behavior: "smooth" });
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/predict`, {
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
        confidence: data.confidence || 0,
        confidence_text: data.confidence_text || "Unknown",
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

    setTimeout(() => {
      const examplesSection = document.getElementById("examples-section");
      if (examplesSection) {
        examplesSection.scrollIntoView({ behavior: "smooth" });
        examplesSection.classList.add("highlight-section");
        setTimeout(() => {
          examplesSection.classList.remove("highlight-section");
        }, 2000);
      }
    }, 100);
  };

  return (
    <>
      {/* Main Analysis Card */}
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
            {/* Text Input */}
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

            {/* Model Selection */}
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
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50/80 px-3 py-1.5 rounded-lg ml-4 border border-purple-100">
                  <Brain className="w-4 h-4" />
                  Choose a model to analyze
                </div>
              </div>
            </div>

            {/* Loading and Results Section */}
            <AnimatePresence>
              {isLoading ? (
                <LoadingState />
              ) : result ? (
                <ResultsSection result={result} onTryAgain={handleReset} />
              ) : null}
            </AnimatePresence>

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

            {/* Action Buttons */}
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
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        id="examples-section"
      >
        <ExamplesSection onExampleClick={handleExampleClick} />

        {/* Deep Learning Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-full"
        >
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
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
    </>
  );
}
