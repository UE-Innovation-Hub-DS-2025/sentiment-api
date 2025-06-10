"use client";

import { motion } from "framer-motion";
import { Brain, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
  );
}
