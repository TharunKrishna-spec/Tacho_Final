
import React, { useState, useMemo, useEffect } from 'react';
import { TachometerIcon } from './icons/TachometerIcon';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { EvervaultCard, Icon } from './EvervaultCard';
import { HyperText } from './HyperText';
import { TachometerDataPoint } from '../types';
import TachometerGauge from './TachometerGauge';
import HistoryChart from './HistoryChart';
import { ChipIcon } from './icons/ChipIcon';
import { FingerprintIcon } from './icons/FingerprintIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';

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

  const [animatedRpm, setAnimatedRpm] = useState(450);

  useEffect(() => {
      const interval = setInterval(() => {
          setAnimatedRpm(Math.floor(Math.random() * 600) + 200); // Random RPM between 200 and 800
      }, 2000);
      return () => clearInterval(interval);
  }, []);

  const mockChartData: TachometerDataPoint[] = useMemo(() => {
      const data: TachometerDataPoint[] = [];
      const now = Date.now();
      for (let i = 30; i > 0; i--) {
          data.push({
              timestamp: now - i * 1000,
              rpm: 450 + Math.sin(i * 0.5) * 200 + Math.random() * 100,
          });
      }
      return data;
  }, []);
  
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

        {/* New Sections */}
        <motion.div className="pt-24 space-y-28 md:space-y-36" variants={itemVariants}>
          {/* Section 1: What It Is */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-64 flex items-center justify-center p-4">
               <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-4">
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="bg-cyan-tech-300/10 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2.5 }}
                  />
                ))}
              </div>
              <TachometerIcon className="relative z-10 w-32 h-32 text-cyan-tech-300" style={{filter: 'drop-shadow(0 0 10px #00F5D4)'}}/>
            </div>
            <div className="text-left md:pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-off-white tracking-wider mb-6">What is Tachometer Monitor?</h2>
              <p className="text-gray-400 leading-relaxed">
                Tachometer Monitor is a real-time data visualization platform designed for makers, hobbyists, and professionals. It connects to your physical tachometer (like an ESP32-based sensor) and streams RPM data directly to a sleek, responsive dashboard.
              </p>
            </div>
          </div>

          {/* Section 2: How It Works */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-off-white tracking-wider mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl p-6 text-center" whileHover={{y: -10}}>
                <div className="flex justify-center mb-4"><ChipIcon className="w-12 h-12 text-cyan-tech-300"/></div>
                <h3 className="text-xl font-semibold text-off-white mb-2">1. Connect Device</h3>
                <p className="text-gray-400 text-sm">Set up your ESP32 or other microcontroller to send tachometer data (RPM, timestamp) to our specified Firebase Realtime Database endpoint. Each device gets a unique ID.</p>
              </motion.div>
              <motion.div className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl p-6 text-center" whileHover={{y: -10}}>
                <div className="flex justify-center mb-4"><FingerprintIcon className="w-12 h-12 text-cyan-tech-300"/></div>
                <h3 className="text-xl font-semibold text-off-white mb-2">2. Enter Device ID</h3>
                <p className="text-gray-400 text-sm">Launch the web app and enter your unique Device ID. Our system will instantly verify its existence and prepare your dashboard.</p>
              </motion.div>
              <motion.div className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl p-6 text-center" whileHover={{y: -10}}>
                <div className="flex justify-center mb-4"><AnalyticsIcon className="w-12 h-12 text-cyan-tech-300"/></div>
                <h3 className="text-xl font-semibold text-off-white mb-2">3. Monitor & Analyze</h3>
                <p className="text-gray-400 text-sm">View live RPM on a futuristic gauge, track historical data on a chart, and save session logs. Compare runs and gain insights into performance.</p>
              </motion.div>
            </div>
          </div>

          {/* Section 3: Visualization Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left md:pl-8 order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-off-white tracking-wider mb-6">Your Data. Your Dashboard.</h2>
              <p className="text-gray-400 leading-relaxed">
                Every movement, every rev — captured and visualized instantly. Whether tuning your kart, testing an engine, or comparing laps — Tachometer Monitor gives you the insights you need, live and beautiful.
              </p>
            </div>
            <motion.div 
              className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl p-4 shadow-glow-cyan order-1 md:order-2"
              whileHover={{scale: 1.05}}
              transition={{type: 'spring', stiffness: 200}}
            >
              <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="col-span-1">
                      <TachometerGauge rpm={animatedRpm} maxRpm={1000} />
                  </div>
                  <div className="col-span-1 h-48 -ml-4">
                      <HistoryChart data={mockChartData} />
                  </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Founders Section */}
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
