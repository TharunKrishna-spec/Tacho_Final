import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '../types';
import { exportSessionToCSV } from '../utils/csvExporter';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CompareIcon } from './icons/CompareIcon';

interface HistoryPanelProps {
  sessions: Session[];
  onSaveSessions: (sessions: Session[]) => void;
  onCompare: (sessionIds: string[]) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ sessions, onSaveSessions, onCompare }) => {
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  
  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");
    
    if (button.classList.contains('bg-cyan-tech-300')) {
        circle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    } else {
        circle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    }

    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) existingRipple.remove();
    button.appendChild(circle);
  };

  const handleSelect = (sessionId: string) => {
    const newSelection = new Set(selectedSessions);
    if (newSelection.has(sessionId)) {
      newSelection.delete(sessionId);
    } else {
      newSelection.add(sessionId);
    }
    setSelectedSessions(newSelection);
  };

  const handleDelete = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    onSaveSessions(updatedSessions);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all session history? This action cannot be undone.")) {
        onSaveSessions([]);
    }
  };

  const handleCompare = () => {
    onCompare(Array.from(selectedSessions));
  };
  
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-off-white tracking-wider">Session History</h2>
        {sessions.length > 0 && (
          <button 
            onClick={handleClearHistory}
            onMouseDown={createRipple}
            className="ripple-container text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {sessions.length > 0 ? (
          <ul className="space-y-3">
            <AnimatePresence>
              {sessions.map(session => (
                <motion.li 
                  key={session.id} 
                  className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${selectedSessions.has(session.id) ? 'bg-cyan-tech-500/20' : 'bg-black/30'}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 245, 212, 0.1)' }}
                  onClick={() => handleSelect(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={selectedSessions.has(session.id)}
                        readOnly
                        className="pointer-events-none form-checkbox h-5 w-5 rounded bg-black/50 border-cyan-tech-300/50 text-cyan-tech-300 focus:ring-cyan-tech-400"
                      />
                      <div>
                        <p className="font-semibold text-off-white">{new Date(session.startTime).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">
                          Duration: {formatDuration(session.duration)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button onClick={(e) => {e.stopPropagation(); exportSessionToCSV(session)}} className="text-gray-400 hover:text-cyan-tech-300" title="Export to CSV"><DownloadIcon className="w-5 h-5"/></button>
                      <button onClick={(e) => {e.stopPropagation(); handleDelete(session.id)}} className="text-gray-400 hover:text-red-400" title="Delete Session"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs text-gray-300">
                    <div>
                      <span className="text-gray-500 block">AVG RPM</span>
                      <span className="font-mono text-base">{session.avgRpm}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">MAX RPM</span>
                      <span className="font-mono text-base">{session.maxRpm}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">MIN RPM</span>
                      <span className="font-mono text-base">{session.minRpm}</span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <p>No past sessions recorded. <br/> Turn the device on and off to save a session.</p>
          </div>
        )}
      </div>
      {sessions.length > 0 && (
         <div className="mt-4 pt-4 border-t border-cyan-tech-300/10">
            <motion.button
                onMouseDown={createRipple}
                onClick={handleCompare}
                disabled={selectedSessions.size < 2}
                className="ripple-container w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent text-sm font-bold rounded-lg text-black bg-cyan-tech-300 hover:bg-cyan-tech-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-cyan-tech-500 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                whileHover={{ scale: selectedSessions.size >= 2 ? 1.05 : 1 }}
                whileTap={{ scale: selectedSessions.size >= 2 ? 0.95 : 1 }}
            >
                <CompareIcon className="w-5 h-5"/>
                Compare Runs ({selectedSessions.size})
            </motion.button>
         </div>
      )}
    </div>
  );
};

export default HistoryPanel;