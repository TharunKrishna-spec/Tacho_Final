
import React, { useState, useMemo } from 'react';
import { User, TachometerDataPoint } from '../types';
import TachometerGauge from './TachometerGauge';
import HistoryChart from './HistoryChart';
import StatCard from './StatCard';
import PowerToggle from './PowerToggle';
import { getTachometerInsights } from '../services/geminiService';
import { LogoutIcon } from './icons/LogoutIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';

interface DashboardProps {
  user: User;
  deviceId: string;
  data: TachometerDataPoint[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isDeviceOn: boolean;
  onLogout: () => void;
  onChangeDevice: () => void;
  onToggleDevice: (isOn: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, deviceId, data, connectionStatus, isDeviceOn, onLogout, onChangeDevice, onToggleDevice }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  
  const currentRPM = isDeviceOn && data.length > 0 ? data[data.length - 1].rpm : 0;

  const { avgRPM, maxRPM } = useMemo(() => {
    if (data.length === 0) return { avgRPM: 0, maxRPM: 0 };
    const rpms = data.map(d => d.rpm);
    const sum = rpms.reduce((a, b) => a + b, 0);
    const avg = sum / data.length;
    const max = Math.max(...rpms);
    return { avgRPM: Math.round(avg), maxRPM: max };
  }, [data]);

  const handleGetInsights = async () => {
    if (data.length < 10) {
      setInsights("Not enough data for analysis. Please wait for at least 10 data points.");
      return;
    }
    setIsLoadingInsights(true);
    setInsights('');
    try {
      const result = await getTachometerInsights(data);
      setInsights(result);
    } catch (error) {
      console.error("Error getting insights:", error);
      setInsights("Sorry, an error occurred while analyzing the data. Please try again.");
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>;
      case 'connecting':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-spin"></div>;
      case 'disconnected':
        return <div className={`w-3 h-3 rounded-full ${isDeviceOn ? 'bg-red-500' : 'bg-slate-500'}`}></div>;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-6">
            <PowerToggle isOn={isDeviceOn} onToggle={onToggleDevice} />
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Device Dashboard</h1>
              <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
                {getStatusIndicator()}
                <span>{deviceId}</span>
                <span className="text-slate-300/50">|</span>
                <span className="capitalize">{connectionStatus}</span>
              </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-slate-300 text-sm hidden sm:inline">{user.email}</span>
          <button onClick={onChangeDevice} className="text-sm text-cyan hover:underline">Change Device</button>
          <button onClick={onLogout} className="p-2 text-slate-300 hover:text-cyan transition-colors" aria-label="Logout"><LogoutIcon className="w-6 h-6"/></button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-navy-800 p-6 rounded-lg shadow-xl flex flex-col items-center justify-center">
          <TachometerGauge rpm={currentRPM} maxRpm={8000} />
        </div>
        
        <div className="lg:col-span-2 bg-navy-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">RPM History (Last 60s)</h2>
          <div className="h-64">
            <HistoryChart data={data} />
          </div>
        </div>
        
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Current RPM" value={currentRPM.toString()} />
          <StatCard title="Average RPM" value={avgRPM.toString()} />
          <StatCard title="Max RPM" value={maxRPM.toString()} />
        </div>

        <div className="lg:col-span-3 bg-navy-800 p-6 rounded-lg shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-slate-100">AI Performance Analysis</h2>
            <button onClick={handleGetInsights} disabled={isLoadingInsights || !isDeviceOn} className="flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-md text-navy-900 bg-cyan hover:bg-opacity-80 disabled:bg-slate-300/50 disabled:text-navy-900/50 disabled:cursor-not-allowed transition-colors">
              <AnalyticsIcon className="w-5 h-5"/>
              {isLoadingInsights ? 'Analyzing...' : 'Get Insights'}
            </button>
          </div>
          {isLoadingInsights && <div className="text-center text-slate-300">Loading analysis...</div>}
          {!isDeviceOn && !insights && <div className="text-center text-slate-300">Turn the device on to analyze performance.</div>}
          {insights && <div className="text-slate-100 bg-navy-900 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">{insights}</div>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
