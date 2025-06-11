import React from 'react';
import { motion } from 'framer-motion';

const LoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex flex-col items-center justify-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-24 h-24">
          <motion.div
            className="absolute inset-0 border-4 border-[#003366] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-[#CC0000] rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.p 
          className="text-gray-600 mt-6 text-lg font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ニュースを集めています...
        </motion.p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="flex justify-between mt-4">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
