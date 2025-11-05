
import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface TachometerGaugeProps {
  rpm: number;
  maxRpm?: number;
}

const TachometerGauge: React.FC<TachometerGaugeProps> = ({ rpm, maxRpm = 1000 }) => {
  const animatedRpmSpring = useSpring(rpm, { 
    stiffness: 120,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    animatedRpmSpring.set(rpm);
  }, [rpm, animatedRpmSpring]);

  // The main angle of the needle based on RPM, driven by the spring
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
    
    const x1 = 50 + 40 * Math.cos((tickAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((tickAngle * Math.PI) / 180);
    const x2 = 50 + 45 * Math.cos((tickAngle * Math.PI) / 180);
    const y2 = 50 + 45 * Math.sin((tickAngle * Math.PI) / 180);
    
    const labelRadius = 34;
    const labelX = 50 + labelRadius * Math.cos((tickAngle * Math.PI) / 180);
    const labelY = 50 + labelRadius * Math.sin((tickAngle * Math.PI) / 180);
    
    return (
      <g key={`major-${i}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} className={"stroke-white"} strokeWidth="1.5" />
        { i > 0 && i % 2 === 0 && 
            <text 
                x={labelX} y={labelY} 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                className="fill-gray-300 text-[6px] font-sans font-bold">
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

    const x1 = 50 + 42 * Math.cos((tickAngle * Math.PI) / 180);
    const y1 = 50 + 42 * Math.sin((tickAngle * Math.PI) / 180);
    const x2 = 50 + 45 * Math.cos((tickAngle * Math.PI) / 180);
    const y2 = 50 + 45 * Math.sin((tickAngle * Math.PI) / 180);

    return (
        <line key={`minor-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className={"stroke-gray-500"} strokeWidth="0.75" />
    );
  });

  const redlineSegments = () => {
    const segments = 10;
    const angleRange = 135 - redlineStartAngle;
    const segmentAngle = angleRange / segments;
    const colors = ['#FBBF24', '#F8A51B', '#F28B12', '#EC7109', '#E55700', '#EF4444', '#E63939', '#DC2E2E', '#D22828', '#C82323'];

    return Array.from({ length: segments }).map((_, i) => {
        const start = redlineStartAngle + i * segmentAngle;
        const end = start + segmentAngle - 1; // -1 for a small gap
        return (
            <path
                key={`redline-seg-${i}`}
                d={arcPath(start, end, 42.5)}
                fill="none"
                stroke={colors[i]}
                strokeWidth="8"
                strokeLinecap="butt"
            />
        );
    });
  };

  return (
    <div className="w-full max-w-xs aspect-square relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <radialGradient id="dialGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#0A0A0A" />
            </radialGradient>
        </defs>
        
        {/* Background & Bezel */}
        <circle cx="50" cy="50" r="50" className="fill-gray-900" />
        <circle cx="50" cy="50" r="48" fill="url(#dialGradient)" />
        <circle cx="50" cy="50" r="47" stroke="#00F5D4" strokeOpacity="0.6" strokeWidth="1" fill="none" />
        
        {/* Ticks */}
        {majorTicks}
        {minorTicks}

        {/* Redline Segments */}
        {redlineSegments()}
        
        <text x="50" y="30" textAnchor="middle" className="fill-gray-400 text-[6px] font-mono tracking-widest">x1000 RPM</text>

        {/* Needle */}
        <motion.g style={{ rotate: angle, transformOrigin: '50 50' }}>
          <motion.path
            d="M 50 15 L 51 50 L 49 50 Z"
            fill="#EF4444"
            style={{
                filter: isRedline ? 'drop-shadow(0 0 4px #ef4444)' : 'drop-shadow(0 0 2px #dc2626)'
            }}
          />
        </motion.g>
        
        {/* Needle pivot */}
        <circle cx="50" cy="50" r="5" className="fill-gray-800" />
        <circle cx="50" cy="50" r="4" className="fill-white" />
        <circle cx="50" cy="50" r="2.5" fill="#EF4444" />
        
        {/* Digital Readout */}
        <rect x="35" y="60" width="30" height="15" rx="3" fill="black" opacity="0.5" />
        <motion.text 
            x="50" y="70" 
            textAnchor="middle" 
            className={`text-sm font-mono font-bold tracking-wider transition-colors duration-300 fill-cyan-tech-300`} 
            style={{filter: `drop-shadow(0 0 5px #00F5D4)`}}
        >
            {roundedRpmText}
        </motion.text>
        <text x="50" y="82" textAnchor="middle" className="fill-gray-400 text-[8px] font-mono tracking-widest">RPM</text>

        {/* Glass Glare Effect */}
        <path d={arcPath(-120, -60, 47)} fill="white" opacity="0.08" />
      </svg>
    </div>
  );
};

export default TachometerGauge;
