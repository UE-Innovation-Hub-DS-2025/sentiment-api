import { motion } from "framer-motion";
import { Brain, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

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

interface SentimentResult {
  text: string;
  prediction: string;
  model: string;
  confidence: number;
  confidence_text: string;
}

interface ResultsSectionProps {
  result: SentimentResult;
  onTryAgain: () => void;
}

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

const ResultsSection = ({ result, onTryAgain }: ResultsSectionProps) => (
  <motion.div
    key="results"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="mb-8"
  >
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sentiment Result */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-2xl">
                {getSentimentEmoji(result.prediction)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sentiment</p>
              <p
                className={`font-semibold ${
                  result.prediction === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {result.prediction.charAt(0).toUpperCase() +
                  result.prediction.slice(1)}
              </p>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Confidence</p>
              <p className="font-semibold text-blue-600">
                {result.confidence_text}
              </p>
            </div>
          </div>

          {/* Model Used */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Model</p>
              <p className="font-semibold text-purple-600">
                {models.find((m) => m.value === result.model)?.label ||
                  result.model}
              </p>
            </div>
          </div>
        </div>

        {/* Original Text - Truncated */}
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100">
          <p className="text-gray-800 text-sm line-clamp-2">
            "
            {result.text.length > 100
              ? result.text.substring(0, 100) + "..."
              : result.text}
            "
          </p>
        </div>

        {/* Try Again Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-center"
        >
          <Button
            onClick={onTryAgain}
            variant="outline"
            className="group hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 mr-2 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-blue-600 transition-colors">
              Try Another Analysis
            </span>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);

export default ResultsSection;
