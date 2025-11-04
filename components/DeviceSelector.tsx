

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { checkDeviceExists } from '../services/tachometerService';
import { HyperText } from './HyperText';

interface DeviceSelectorProps {
  onDeviceSelect: (deviceId: string) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ onDeviceSelect }) => {
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createRipple = (e: React.MouseEvent) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");
    circle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    const existingRipple = button.querySelector(".ripple");
    if(existingRipple) existingRipple.remove();

    button.appendChild(circle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = deviceId.trim();

    if (!trimmedId) {
      setError('Device ID cannot be empty. Please enter a valid ID.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const deviceExists = await checkDeviceExists(trimmedId);
      if (deviceExists) {
        onDeviceSelect(trimmedId);
      } else {
        setError('Device not found. Please check the ID and ensure your hardware is sending data.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during verification.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }
    setDeviceId(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans p-4">
      <motion.div 
        className="w-full max-w-lg p-8 space-y-6 text-center bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-glow-cyan"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <HyperText
            text="Tachometer    Interface"
            className="text-4xl font-bold text-off-white tracking-wider"
          />
        </div>
        <p className="text-gray-400">Enter Device ID to initiate connection.</p>
        <motion.form 
          className="mt-8"
          onSubmit={handleSubmit}
          animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={error ? { duration: 0.4, ease: 'easeInOut' } : {}}
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-full">
                <input
                  type="text"
                  disabled={isLoading}
                  className={`flex-grow w-full px-4 py-3 border bg-black/50 placeholder-gray-500 text-off-white rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 ${
                    error 
                    ? 'border-red-500/70 focus:ring-red-500/80' 
                    : 'border-cyan-tech-300/30 focus:ring-cyan-tech-300/80'
                  }`}
                  placeholder="e.g., TACH-ESP32-001"
                  value={deviceId}
                  onChange={handleChange}
                  aria-invalid={!!error}
                  aria-describedby="device-id-error"
                />
                 {error && (
                    <p id="device-id-error" className="text-red-400 text-sm mt-2 text-left pl-1">{error}</p>
                 )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              onMouseDown={createRipple}
              className="ripple-container w-full sm:w-auto shrink-0 flex justify-center py-3 px-6 border border-transparent text-sm font-bold rounded-lg text-black bg-cyan-tech-300 hover:bg-cyan-tech-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-cyan-tech-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-wait"
            >
              {isLoading ? 'VERIFYING...' : 'CONNECT'}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default DeviceSelector;