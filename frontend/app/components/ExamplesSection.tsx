import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exampleTexts } from "../lib/constants";

interface ExamplesSectionProps {
  onExampleClick: (text: string) => void;
}

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

const ExamplesSection = ({ onExampleClick }: ExamplesSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="h-full"
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
              onClick={() => onExampleClick(example.text)}
              className="w-full p-3 text-left bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 rounded-lg border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 group"
            >
              <p className="text-sm text-gray-700 group-hover:text-gray-900">
                {example.text}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${getSentimentColor(example.sentiment)}`}
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
);

export default ExamplesSection;
