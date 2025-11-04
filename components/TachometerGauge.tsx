import React from 'react';

interface TachometerGaugeProps {
  rpm: number;
  maxRpm?: number;
}

const TachometerGauge: React.FC<TachometerGaugeProps> = ({ rpm, maxRpm = 1000 }) => {
  const normalizedRpm = Math.min(Math.max(rpm, 0), maxRpm);
  const angle = (normalizedRpm / maxRpm) * 270 - 135; // Map RPM to a 270 degree arc

  const redlineStart = maxRpm * 0.8;
  const isRedline = normalizedRpm >= redlineStart;

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tickRpm = i * (maxRpm / 10);
    const tickAngle = (tickRpm / maxRpm) * 270 - 135;
    const isRedlineTick = tickRpm >= redlineStart;
    
    // Tick lines
    const x1 = 50 + 40 * Math.cos((tickAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((tickAngle * Math.PI) / 180);
    const x2 = 50 + 45 * Math.cos((tickAngle * Math.PI) / 180);
    const y2 = 50 + 45 * Math.sin((tickAngle * Math.PI) / 180);
    
    // Tick labels
    const labelRadius = 34;
    const labelX = 50 + labelRadius * Math.cos((tickAngle * Math.PI) / 180);
    const labelY = 50 + labelRadius * Math.sin((tickAngle * Math.PI) / 180);
    
    return (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} className={isRedlineTick ? "stroke-red-500" : "stroke-gray-600"} strokeWidth="1.5" />
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

  return (
    <div className="w-full max-w-xs aspect-square relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9BFCF3" />
                <stop offset="100%" stopColor="#00F5D4" />
            </linearGradient>
        </defs>
        
        {/* Background & Bezel */}
        <circle cx="50" cy="50" r="48" className="fill-black/30" />
        <circle cx="50" cy="50" r="46" className="fill-none stroke-black/50" strokeWidth="1" />
        <circle cx="50" cy="50" r="45" className="fill-background-dark" />
        
        {/* Gauge Track */}
        <path
          d={arcPath(-135, 135, 42.5)}
          fill="none"
          className="stroke-gray-800"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Active Gauge Arc */}
        {normalizedRpm > 0 && (
             <path
                d={arcPath(-135, angle, 42.5)}
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                style={{filter: 'url(#glow)'}}
             />
        )}
        
        {/* Redline track */}
        <path
          d={arcPath(redlineStartAngle, 135, 42.5)}
          fill="none"
          className="stroke-red-600/60"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Ticks */}
        {ticks}
        <text x="50" y="30" textAnchor="middle" className="fill-gray-500 text-[6px] font-mono tracking-widest">x100 RPM</text>

        {/* Needle */}
        <g transform={`rotate(${angle} 50 50)`} style={{ transition: 'transform 0.5s ease-out' }}>
          <path d="M 50 10 L 52 50 L 48 50 Z" className="fill-cyan-tech-300" style={{filter: 'drop-shadow(0 0 4px #00F5D4)'}} />
        </g>
        
        {/* Needle pivot */}
        <circle cx="50" cy="50" r="5" className="fill-gray-300" />
        <circle cx="50" cy="50" r="3" className="fill-background-dark" />
        
        {/* Digital Readout */}
        <text x="50" y="65" textAnchor="middle" className={`text-[1.25rem] font-mono font-bold tracking-wider transition-colors duration-300 ${isRedline ? 'fill-red-500' : 'fill-off-white'}`} style={{filter: `drop-shadow(0 0 5px ${isRedline ? '#EF4444' : '#00F5D4'})`}}>{Math.round(rpm)}</text>
        <text x="50" y="80" textAnchor="middle" className="fill-gray-400 text-xs font-mono tracking-widest">RPM</text>
      </svg>
    </div>
  );
};

export default TachometerGauge;