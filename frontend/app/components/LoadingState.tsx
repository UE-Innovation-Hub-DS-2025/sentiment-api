import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingState = () => (
  <motion.div
    key="loading"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100 mb-8"
  >
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
        <div className="absolute -inset-1 bg-blue-100 rounded-full animate-ping opacity-20"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">Analyzing Text</p>
      </div>
      <div className="w-full max-w-sm h-1.5 bg-blue-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </div>
  </motion.div>
);

export default LoadingState;
