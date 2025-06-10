'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Brain, MessageCircle, Sparkles, TrendingUp, ExternalLink, User, Github, Linkedin, Zap, Clock } from 'lucide-react';

interface SentimentResult {
  text: string;
  prediction: string;
  model: string;
}

const models = [
  { value: 'logistic_regression', label: 'Logistic Regression', type: 'traditional' },
  { value: 'naive_bayes', label: 'Naive Bayes', type: 'traditional' },
  { value: 'svm', label: 'Support Vector Machine', type: 'traditional' },
  { value: 'random_forest', label: 'Random Forest', type: 'traditional' },
];

const deepLearningModels = [
  { label: 'BERT (Transformer)', description: 'State-of-the-art language understanding' },
  { label: 'RoBERTa', description: 'Robustly optimized BERT approach' },
  { label: 'DistilBERT', description: 'Lightweight BERT variant' },
  { label: 'LSTM Neural Network', description: 'Sequential pattern recognition' },
];

const getSentimentEmoji = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
      return '😐';
    default:
      return '🤔';
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'negative':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'neutral':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export default function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim() || !selectedModel) {
      setError('Please enter text and select a model');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:3000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const data = await response.json();
      setResult({
        text: text.trim(),
        prediction: data.prediction || 'Unknown',
        model: selectedModel,
      });
    } catch (err) {
      setError('Failed to analyze sentiment. Please check your connection and try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setSelectedModel('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                onClick={() => window.open('https://ataie.me/', '_blank')}
              >
                <User className="w-4 h-4 mr-2 group-hover:text-blue-600 transition-colors" />
                <span className="group-hover:text-blue-600 transition-colors">Portfolio</span>
                <ExternalLink className="w-3 h-3 ml-1 group-hover:text-blue-600 transition-colors" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg">
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Sentiment Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock the emotional intelligence of your text with cutting-edge machine learning. 
            Analyze sentiment with precision using our advanced AI models and get instant insights 
            into the emotional tone of any content.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>4 ML Models</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>High Accuracy</span>
            </div>
          </div>
        </motion.div>

        {/* Deep Learning Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                Deep Learning Models
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Next-generation neural networks for even more accurate sentiment analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deepLearningModels.map((model, index) => (
                  <motion.div
                    key={model.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{model.label}</p>
                      <p className="text-xs text-gray-500">{model.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                Text Analysis Dashboard
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Enter your text below and choose a machine learning model to analyze its emotional sentiment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Text Input */}
              <div className="space-y-3">
                <Label htmlFor="text-input" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Text to Analyze
                </Label>
                <Textarea
                  id="text-input"
                  placeholder="Enter your text here... (e.g., 'I absolutely love this new product!' or 'This service was quite disappointing.')"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[140px] resize-none text-base leading-relaxed border-2 focus:border-blue-300 transition-all duration-300 rounded-xl"
                  disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{text.length} characters</span>
                  <span>{text.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-3">
                <Label htmlFor="model-select" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  Traditional Machine Learning Models
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoading}>
                  <SelectTrigger className="text-base h-12 border-2 focus:border-purple-300 transition-all duration-300 rounded-xl">
                    <SelectValue placeholder="Choose an AI model for analysis" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value} className="text-base py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                          {model.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
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

        {/* Results */}
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
                  <CardDescription className="text-base text-gray-600">
                    AI-powered sentiment analysis completed successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
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

                  {/* Sentiment Result */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      Predicted Sentiment
                    </Label>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="secondary"
                        className={`px-6 py-3 text-xl font-bold ${getSentimentColor(result.prediction)} border-2 rounded-xl shadow-lg`}
                      >
                        <span className="mr-3 text-2xl">
                          {getSentimentEmoji(result.prediction)}
                        </span>
                        {result.prediction.charAt(0).toUpperCase() + result.prediction.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Model Used */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      AI Model Used
                    </Label>
                    <Badge variant="outline" className="text-base px-4 py-2 border-2 rounded-xl">
                      <Brain className="w-4 h-4 mr-2 text-blue-600" />
                      {models.find(m => m.value === result.model)?.label || result.model}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 pb-8"
        >
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Powered by advanced machine learning algorithms for accurate sentiment detection
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