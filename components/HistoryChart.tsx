import React, { useMemo, useState, useRef, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ReferenceLine, Label } from 'recharts';
import { TachometerDataPoint } from '../types';

interface HistoryChartProps {
  data: TachometerDataPoint[];
}

const INITIAL_DOMAIN: [number, number] = [-30, 0];

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const [xDomain, setXDomain] = useState<[number, number]>(INITIAL_DOMAIN);
  const isPanningRef = useRef(false);
  const panStartRef = useRef<number | null>(null);

  const formattedData = useMemo(() => {
    if (data.length < 2) {
      return data.map(d => ({...d, time: 0}));
    }
    const lastTimestamp = data[data.length - 1].timestamp;
    return data.map(d => ({
      ...d,
      time: Math.round((d.timestamp - lastTimestamp) / 1000),
    }));
  }, [data]);

  const avgRPM = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.rpm, 0);
    return sum / data.length;
  }, [data]);

  const handleReset = () => {
    setXDomain(INITIAL_DOMAIN);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const { deltaY } = e;
    const zoomFactor = 0.1;

    setXDomain(([min, max]) => {
      const range = max - min;
      let newMin, newMax;

      if (deltaY < 0) { // Zoom in
        newMin = min + range * zoomFactor;
        newMax = max - range * zoomFactor;
      } else { // Zoom out
        newMin = min - range * zoomFactor;
        newMax = max - range * zoomFactor;
      }
      
      const newRange = newMax - newMin;
      // Prevent zooming out too far or in too close
      if (newRange > (INITIAL_DOMAIN[1] - INITIAL_DOMAIN[0]) * 4 || newRange < 2) {
        return [min, max]; // Abort zoom if limits are breached
      }

      return [newMin, newMax];
    });
  }, []);
  
  const handleMouseDown = useCallback((e: any) => {
    if (e && e.activeLabel !== undefined) {
      isPanningRef.current = true;
      panStartRef.current = e.activeLabel;
    }
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (isPanningRef.current && e && e.activeLabel !== undefined && panStartRef.current !== null) {
      const delta = panStartRef.current - e.activeLabel;
      setXDomain(([min, max]) => [min + delta, max + delta]);
    }
  }, []);
  
  const handleMouseUpOrLeave = useCallback(() => {
    isPanningRef.current = false;
    panStartRef.current = null;
  }, []);

  return (
    <div className="w-full h-full flex flex-col" onWheel={handleWheel}>
      <div className="flex-grow cursor-grab active:cursor-grabbing">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            <defs>
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F5D4" stopOpacity={0}/>
                </linearGradient>
                <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 212, 0.1)" />
            <XAxis 
                dataKey="time" 
                type="number" 
                domain={xDomain}
                allowDataOverflow
                unit="s"
                stroke="#888" 
                tick={{ fill: '#888', fontSize: 12 }} 
                tickFormatter={(tick) => Math.round(tick).toString()}
            />
            <YAxis stroke="#888" domain={[0, 8000]} tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    backdropFilter: 'blur(5px)',
                    borderColor: 'rgba(0, 245, 212, 0.3)',
                    color: '#E6E6E6',
                    borderRadius: '8px',
                }}
                labelStyle={{ color: '#9BFCF3', fontWeight: 'bold' }}
                labelFormatter={(value) => `${Number(value).toFixed(1)}s`}
                formatter={(value: number) => [value.toFixed(0), 'RPM']}
            />
            {avgRPM > 0 && (
                <ReferenceLine y={avgRPM} stroke="#F59E0B" strokeDasharray="4 4">
                    <Label value={`Avg: ${Math.round(avgRPM)}`} position="insideTopRight" fill="#F59E0B" fontSize={10} fontWeight="bold" />
                </ReferenceLine>
            )}
            <Area 
                type="natural" 
                dataKey="rpm" 
                stroke="none" 
                fill="url(#area-gradient)" 
                isAnimationActive={false}
            />
            <Line 
                type="natural" 
                dataKey="rpm" 
                stroke="#00F5D4" 
                strokeWidth={3} 
                dot={false} 
                isAnimationActive={false}
                style={{ filter: 'url(#line-glow)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end items-center mt-2 pr-5">
         <button 
           onClick={handleReset} 
           className="text-xs px-3 py-1 bg-cyan-tech-500/20 text-cyan-tech-200 rounded-md hover:bg-cyan-tech-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-tech-400"
         >
           Reset View
         </button>
       </div>
    </div>
  );
};

export default HistoryChart;