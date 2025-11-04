
import React, { useState, useMemo, useEffect } from 'react';
import { TachometerIcon } from './icons/TachometerIcon';
// FIX: Import Variants type from framer-motion to correctly type animation variants.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { EvervaultCard, Icon } from './EvervaultCard';
import { HyperText } from './HyperText';

interface LandingPageProps {
  onGetStarted: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0, 0, 0.58, 1.0],
    },
  },
};


const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const words = useMemo(
    () => ["POWERFUL", "PRECISE", "DYNAMIC", "EFFICIENT", "LIVE"],
    []
  );

  const founders = useMemo(
    () => [
      { name: 'Tharun Krishna', initials: 'TK' },
      { name: 'GokulRaj', initials: 'GR' },
      { name: 'Jayakumar', initials: 'JK' }
    ], []
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    return () => clearInterval(intervalId);
  }, [words.length]);
  
  return (
    <div className="min-h-screen flex items-center justify-center font-sans p-4 text-center overflow-hidden">
      <motion.div 
        className="relative w-full max-w-5xl p-8 space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 -z-10 bg-panel-dark backdrop-blur-2xl border border-cyan-tech-300/20 rounded-3xl opacity-50 transform-gpu scale-90"></div>
        
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
            <TachometerIcon className="w-32 h-32 text-cyan-tech-300" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{ textShadow: '0 0 15px rgba(0, 245, 212, 0.4)' }}
          className="flex justify-center"
        >
          <HyperText
            text="TACHOMETER"
            className="text-5xl md:text-7xl font-bold text-off-white tracking-wider"
            duration={1500}
           />
        </motion.div>

        <motion.div
          className="text-xl md:text-2xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto flex justify-center items-center gap-2 md:gap-3 h-10"
          variants={itemVariants}
        >
          <span>Real-time</span>
          <div className="relative w-48 h-full">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                className="absolute inset-0 flex items-center justify-center font-semibold text-cyan-tech-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <span>Monitoring</span>
        </motion.div>

        <motion.p 
          className="text-gray-400 max-w-xl mx-auto"
          variants={itemVariants}
        >
          Connect to your ESP32-powered device and visualize RPM data with unparalleled precision and futuristic aesthetics.
        </motion.p>
        
        <motion.div className="pt-6" variants={itemVariants}>
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto shrink-0 flex justify-center items-center mx-auto py-4 px-10 border border-transparent text-md font-bold rounded-lg text-black bg-cyan-tech-300 hover:bg-cyan-tech-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-cyan-tech-500 transition-all duration-300 transform hover:scale-105 shadow-glow-cyan"
          >
            GET STARTED
          </button>
        </motion.div>

        {/* New Founders Section */}
        <motion.div className="pt-20" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-off-white tracking-wider mb-12">Meet The Founders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {founders.map((founder) => (
                    <div key={founder.name} className="border border-cyan-tech-300/20 flex flex-col items-center p-4 relative h-[24rem] rounded-3xl">
                        <Icon className="absolute h-6 w-6 -top-3 -left-3 text-cyan-tech-300" />
                        <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-cyan-tech-300" />
                        <Icon className="absolute h-6 w-6 -top-3 -right-3 text-cyan-tech-300" />
                        <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-cyan-tech-300" />

                        <EvervaultCard text={founder.initials} />

                        <h3 className="text-off-white mt-4 text-lg font-semibold tracking-wider">
                            {founder.name}
                        </h3>
                    </div>
                ))}
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default LandingPage;
