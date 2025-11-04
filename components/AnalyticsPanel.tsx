import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TachometerDataPoint } from '../types';

interface AnalyticsPanelProps {
  data: TachometerDataPoint[];
}

const BINS = [0, 200, 400, 600, 800, 1000];
const COLORS = ['#CCFBF1', '#99F6E4', '#5EEAD4', '#2DD4BF', '#14B8A6', '#0D9488', '#0F766E', '#115E59'];

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ data }) => {
  const distributionData = useMemo(() => {
    const bins = BINS.slice(0, -1).map((binStart, index) => {
      const binEnd = BINS[index + 1];
      return {
        name: `${binStart}-${binEnd}`,
        count: 0,
      };
    });

    if (data.length > 0) {
        data.forEach(point => {
            for (let i = 0; i < BINS.length - 1; i++) {
                if (point.rpm > BINS[i] && point.rpm <= BINS[i + 1]) {
                    bins[i].count++;
                    break;
                }
            }
        });
    }

    return bins;
  }, [data]);

  return (
    <div className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-off-white mb-4 tracking-wider">RPM Distribution</h2>
      <div className="h-64">
        {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 212, 0.1)" />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis stroke="#888" allowDecimals={false} tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip
                    cursor={{ fill: 'rgba(0, 245, 212, 0.1)' }}
                    contentStyle={{
                        backgroundColor: 'rgba(10, 10, 10, 0.8)',
                        backdropFilter: 'blur(5px)',
                        borderColor: 'rgba(0, 245, 212, 0.3)',
                        color: '#E6E6E6',
                        borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#9BFCF3', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Start the device to see analytics.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;