
import React, { useMemo, useState } from 'react';
// FIX: Import Variants type from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';
import { TachometerDataPoint, Session } from '../types';
import TachometerGauge from './TachometerGauge';
import HistoryChart from './HistoryChart';
import StatCard from './StatCard';
import PowerToggle from './PowerToggle';
import AnalyticsPanel from './AnalyticsPanel';
import HistoryPanel from './HistoryPanel';
import ComparisonModal from './ComparisonModal';
import { HyperText } from './HyperText';

interface DashboardProps {
  deviceId: string;
  chartData: TachometerDataPoint[];
  sessionData: TachometerDataPoint[];
  sessions: Session[];
  onSaveSessions: (sessions: Session[]) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isDeviceOn: boolean;
  onChangeDevice: () => void;
  onToggleDevice: (isOn: boolean) => void;
  isTogglingDevice: boolean;
  error: string | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};


const Dashboard: React.FC<DashboardProps> = ({ 
  deviceId, 
  chartData, 
  sessionData,
  sessions,
  onSaveSessions,
  connectionStatus, 
  isDeviceOn, 
  onChangeDevice, 
  onToggleDevice, 
  isTogglingDevice, 
  error 
}) => {
  const [sessionsToCompare, setSessionsToCompare] = useState<Session[]>([]);
  
  const currentRPM = isDeviceOn && chartData.length > 0 ? chartData[chartData.length - 1].rpm : 0;

  const { avgRPM, maxRPM } = useMemo(() => {
    if (sessionData.length === 0) return { avgRPM: 0, maxRPM: 0 };
    const rpms = sessionData.map(d => d.rpm);
    const sum = rpms.reduce((a, b) => a + b, 0);
    const avg = sum / sessionData.length;
    const max = Math.max(...rpms);
    return { avgRPM: Math.round(avg), maxRPM: max };
  }, [sessionData]);
  
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>;
      case 'connecting':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>;
      case 'disconnected':
        return <div className={`w-3 h-3 rounded-full ${isDeviceOn ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-gray-600'}`}></div>;
    }
  };
  
  const handleCompareRequest = (selectedSessionIds: string[]) => {
      const selectedSessions = sessions.filter(s => selectedSessionIds.includes(s.id));
      setSessionsToCompare(selectedSessions);
  };

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
        <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-6">
              <PowerToggle isOn={isDeviceOn} onToggle={onToggleDevice} disabled={isTogglingDevice} />
              <div>
                <HyperText
                  text="Device Dashboard"
                  className="text-3xl font-bold text-off-white tracking-wide"
                />
                <div className="flex items-center gap-2 text-gray-400 font-mono text-sm mt-1">
                  {getStatusIndicator()}
                  <span>{deviceId}</span>
                  <span className="text-gray-400/50">|</span>
                  <span className="capitalize">{connectionStatus}</span>
                </div>
              </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onChangeDevice} className="text-sm text-cyan-tech-300 hover:text-cyan-tech-200 transition-colors font-semibold tracking-wider">CHANGE DEVICE</button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 text-center bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 transition-opacity duration-300" role="alert">
            {error}
          </div>
        )}

        <motion.main 
          className="grid grid-cols-1 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={itemVariants}>
              <div className="md:col-span-1 bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
                <TachometerGauge rpm={currentRPM} maxRpm={1000} />
              </div>
              
              <div className="md:col-span-2 bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-off-white mb-4 tracking-wider">Live RPM (Last 60s)</h2>
                <div className="h-64">
                  <HistoryChart data={chartData} />
                </div>
              </div>

               <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Live RPM" value={currentRPM.toString()} />
                <StatCard title="Session Avg RPM" value={avgRPM.toString()} />
                <StatCard title="Session Max RPM" value={maxRPM.toString()} />
              </div>
              
              <div className="md:col-span-3">
                <AnalyticsPanel data={sessionData} />
              </div>
          </motion.div>

          <motion.div variants={itemVariants}>
              <HistoryPanel 
                sessions={sessions}
                onSaveSessions={onSaveSessions}
                onCompare={handleCompareRequest}
              />
          </motion.div>
        </motion.main>
      </div>

      {sessionsToCompare.length > 0 && (
          <ComparisonModal 
            sessions={sessionsToCompare}
            onClose={() => setSessionsToCompare([])}
          />
      )}
    </>
  );
};

export default Dashboard;