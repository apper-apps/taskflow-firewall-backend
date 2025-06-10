import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ itemCount = 5 }) => {
  return (
    <div className="space-y-4">
      {[...Array(itemCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg p-4 shadow-card"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;