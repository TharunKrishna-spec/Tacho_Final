import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface TachometerGaugeProps {
  rpm: number;
  maxRpm?: number;
}

const TachometerGauge: React.FC<TachometerGaugeProps> = ({ rpm, maxRpm = 1000 }) => {
  const animatedRpmSpring = useSpring(rpm, { 
    stiffness: 80, 
    damping: 25,
    mass: 0.8
  });

  useEffect(() => {
    animatedRpmSpring.set(rpm);
  }, [rpm, animatedRpmSpring]);

  const angle = useTransform(animatedRpmSpring, [0, maxRpm], [-135, 135]);
  const isRedline = rpm >= maxRpm * 0.8;
  const roundedRpmText = useTransform(animatedRpmSpring, (v) => Math.round(v));

  const redlineStart = maxRpm * 0.8;

  const arcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = {
      x: 50 + radius * Math.cos(startAngle * Math.PI / 180),
      y: 50 + radius * Math.sin(startAngle * Math.PI / 180)
    };
    const end = {
      x: 50 + radius * Math.cos(endAngle * Math.PI / 180),
      y: 50 + radius * Math.sin(endAngle * Math.PI / 180)
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };
  
  const redlineStartAngle = (redlineStart / maxRpm) * 270 - 135;

  const majorTicks = Array.from({ length: 11 }, (_, i) => {
    const tickRpm = i * (maxRpm / 10);
    const tickAngle = (tickRpm / maxRpm) * 270 - 135;
    const isRedlineTick = tickRpm >= redlineStart;
    
    const x1 = 50 + 40 * Math.cos((tickAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((tickAngle * Math.PI) / 180);
    const x2 = 50 + 45 * Math.cos((tickAngle * Math.PI) / 180);
    const y2 = 50 + 45 * Math.sin((tickAngle * Math.PI) / 180);
    
    const labelRadius = 34;
    const labelX = 50 + labelRadius * Math.cos((tickAngle * Math.PI) / 180);
    const labelY = 50 + labelRadius * Math.sin((tickAngle * Math.PI) / 180);
    
    return (
      <g key={`major-${i}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} className={isRedlineTick ? "stroke-red-500/80" : "stroke-gray-500"} strokeWidth="1.5" />
        { i > 0 && i % 2 === 0 && 
            <text 
                x={labelX} y={labelY} 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                className="fill-gray-400 text-[6px] font-sans font-bold">
                {i}
            </text>
        }
      </g>
    );
  });

  const minorTicks = Array.from({ length: 51 }, (_, i) => {
    if (i % 5 === 0) return null; // Skip major tick positions
    const tickRpm = i * (maxRpm / 50);
    const tickAngle = (tickRpm / maxRpm) * 270 - 135;
    if (tickAngle > 135) return null;

    const isRedlineTick = tickRpm >= redlineStart;

    const x1 = 50 + 42 * Math.cos((tickAngle * Math.PI) / 180);
    const y1 = 50 + 42 * Math.sin((tickAngle * Math.PI) / 180);
    const x2 = 50 + 45 * Math.cos((tickAngle * Math.PI) / 180);
    const y2 = 50 + 45 * Math.sin((tickAngle * Math.PI) / 180);

    return (
        <line key={`minor-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className={isRedlineTick ? "stroke-red-500/50" : "stroke-gray-700"} strokeWidth="0.75" />
    );
  });
  
  const activeArcD = useTransform(animatedRpmSpring, [0.01, maxRpm], (latestRpm) => {
    const rpmAngle = (Math.min(Math.max(latestRpm, 0), maxRpm) / maxRpm) * 270 - 135;
    return arcPath(-135, rpmAngle, 42.5);
  });

  return (
    <div className="w-full max-w-xs aspect-square relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9BFCF3" />
                <stop offset="100%" stopColor="#00F5D4" />
            </linearGradient>
            <linearGradient id="redlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <radialGradient id="dialGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#0A0A0A" />
            </radialGradient>
        </defs>
        
        {/* Background & Bezel */}
        <circle cx="50" cy="50" r="50" className="fill-gray-900" />
        <circle cx="50" cy="50" r="48" className="fill-black/50" />
        <circle cx="50" cy="50" r="47" stroke="url(#gaugeGradient)" strokeOpacity="0.3" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="45" fill="url(#dialGradient)" />
        
        {/* Gauge Track */}
        <path
          d={arcPath(-135, 135, 42.5)}
          fill="none"
          className="stroke-black/50"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Redline track */}
        <path
          d={arcPath(redlineStartAngle, 135, 42.5)}
          fill="none"
          stroke="url(#redlineGradient)"
          strokeOpacity="0.8"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Active Gauge Arc */}
        <motion.path
            d={activeArcD}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{filter: 'url(#glow)'}}
        />
        
        {/* Ticks */}
        {majorTicks}
        {minorTicks}
        <text x="50" y="30" textAnchor="middle" className="fill-gray-500 text-[6px] font-mono tracking-widest">x1000 RPM</text>

        {/* Needle */}
        <motion.g style={{ rotate: angle, transformOrigin: '50% 50%' }}>
          <path d="M 50 48 L 49 12 C 49.5 11, 50.5 11, 51 12 L 50 48 Z" className="fill-cyan-tech-300" style={{filter: 'drop-shadow(0 0 4px #00F5D4)'}} />
        </motion.g>
        
        {/* Needle pivot */}
        <circle cx="50" cy="50" r="5" className="fill-gray-800" />
        <circle cx="50" cy="50" r="4" className="fill-gray-300" />
        <circle cx="50" cy="50" r="2" className="fill-background-dark" />
        
        {/* Digital Readout */}
        <rect x="35" y="60" width="30" height="15" rx="3" fill="black" opacity="0.3" />
        <motion.text 
            x="50" y="70" 
            textAnchor="middle" 
            className={`text-sm font-mono font-bold tracking-wider transition-colors duration-300 ${isRedline ? 'fill-red-400' : 'fill-off-white'}`} 
            style={{filter: `drop-shadow(0 0 5px ${isRedline ? '#F87171' : '#00F5D4'})`}}
        >
            {roundedRpmText}
        </motion.text>
        <text x="50" y="82" textAnchor="middle" className="fill-gray-400 text-[8px] font-mono tracking-widest">RPM</text>

        {/* Glass Glare Effect */}
        <path d={arcPath(-120, -60, 45)} fill="white" opacity="0.08" />
      </svg>
    </div>
  );
};

export default TachometerGauge;