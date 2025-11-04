
import React from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Session } from '../types';

interface ComparisonModalProps {
  sessions: Session[];
  onClose: () => void;
}

const COLORS = ["#00F5D4", "#4ADE80", "#60A5FA", "#F87171", "#C084FC"];

const ComparisonModal: React.FC<ComparisonModalProps> = ({ sessions, onClose }) => {
  const chartData = sessions.map(session => {
    return session.data.map(point => ({
      ...point,
      session: session.id,
      timeElapsed: (point.timestamp - session.startTime) / 1000,
    }));
  }).flat();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-panel-dark border border-cyan-tech-300/20 rounded-2xl shadow-glow-cyan w-full max-w-4xl h-full max-h-[80vh] p-6 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-off-white tracking-wider">Session Comparison</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
              <defs>
                {sessions.map((session, index) => (
                  <linearGradient key={`grad-${session.id}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 212, 0.1)" />
              <XAxis 
                type="number" 
                dataKey="timeElapsed" 
                name="Time" 
                unit="s" 
                stroke="#888" 
                tick={{ fill: '#888', fontSize: 12 }} 
                domain={['dataMin', 'dataMax']}
                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10, fill: '#888' }}
              />
              <YAxis 
                stroke="#888" 
                domain={[0, 1000]} 
                tick={{ fill: '#888', fontSize: 12 }} 
                label={{ value: 'RPM', angle: -90, position: 'insideLeft', fill: '#888' }}
              />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    borderColor: 'rgba(0, 245, 212, 0.3)',
                    color: '#E6E6E6',
                    borderRadius: '8px',
                }}
                labelStyle={{ color: '#9BFCF3' }}
              />
              <Legend formatter={(value, entry, index) => <span className="text-off-white">{new Date(sessions[index].startTime).toLocaleDateString()}</span>} />
              {sessions.map((session, index) => (
                <React.Fragment key={session.id}>
                    <Area 
                        type="natural" 
                        dataKey="rpm" 
                        data={session.data.map(p => ({ timeElapsed: (p.timestamp - session.startTime) / 1000, rpm: p.rpm }))} 
                        stroke="none" 
                        fill={`url(#color-${index})`}
                        name={new Date(session.startTime).toLocaleString()}
                        isAnimationActive={false}
                    />
                    <Line 
                        type="natural" 
                        dataKey="rpm" 
                        data={session.data.map(p => ({ timeElapsed: (p.timestamp - session.startTime) / 1000, rpm: p.rpm }))} 
                        stroke={COLORS[index % COLORS.length]} 
                        strokeWidth={2} 
                        dot={false}
                        name={new Date(session.startTime).toLocaleString()}
                        isAnimationActive={false}
                    />
                </React.Fragment>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;