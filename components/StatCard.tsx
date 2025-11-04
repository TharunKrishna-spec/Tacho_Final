
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <motion.div
      className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6 text-center h-full flex flex-col justify-center"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-4xl font-bold text-off-white mt-2 font-mono tracking-wider">{value}</p>
    </motion.div>
  );
};

export default StatCard;