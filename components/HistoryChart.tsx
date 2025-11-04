
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TachometerDataPoint } from '../types';

interface HistoryChartProps {
  data: TachometerDataPoint[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={formattedData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
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
            domain={[-30, 0]}
            unit="s"
            stroke="#888" 
            tick={{ fill: '#888', fontSize: 12 }} 
        />
        <YAxis stroke="#888" domain={[0, 1000]} tick={{ fill: '#888', fontSize: 12 }} />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(5px)',
                borderColor: 'rgba(0, 245, 212, 0.3)',
                color: '#E6E6E6',
                borderRadius: '8px',
            }}
            labelStyle={{ color: '#9BFCF3', fontWeight: 'bold' }}
            labelFormatter={(value) => `${value}s`}
        />
        <Area 
            type="natural" 
            dataKey="rpm" 
            stroke="none" 
            fill="url(#area-gradient)" 
            isAnimationActive={true}
            animationDuration={300}
            animationEasing="ease-out"
        />
        <Line 
            type="natural" 
            dataKey="rpm" 
            stroke="#00F5D4" 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={true}
            animationDuration={300}
            animationEasing="ease-out"
            style={{ filter: 'url(#line-glow)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;