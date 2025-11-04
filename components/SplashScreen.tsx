import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SpiralAnimation } from './SpiralAnimation';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 4000); // 4-second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <SpiralAnimation />
      
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={buttonVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <button
          onClick={onEnter}
          className="text-white text-2xl tracking-[0.2em] uppercase font-extralight transition-all duration-700 hover:tracking-[0.3em] animate-pulse disabled:animate-none disabled:opacity-0"
          disabled={!buttonVisible}
        >
          Enter
        </button>
      </motion.div>
    </div>
  );
};

export default SplashScreen;