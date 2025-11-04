import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import DeviceSelector from './components/DeviceSelector';
import Dashboard from './components/Dashboard';
import { TachometerDataPoint, Session } from './types';
import { startDataStream, setDevicePowerState } from './services/tachometerService';
import ParticlesBackground from './components/ParticlesBackground';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<'splash' | 'main'>('splash');
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  
  // State for real-time chart (last 30 data points)
  const [chartData, setChartData] = useState<TachometerDataPoint[]>([]);
  // State for the complete data of the current, active session
  const [currentSessionData, setCurrentSessionData] = useState<TachometerDataPoint[]>([]);
  
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [isDeviceOn, setIsDeviceOn] = useState<boolean>(false);
  const [isTogglingDevice, setIsTogglingDevice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Session state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('tachometerSessions');
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (e) {
      console.error("Failed to parse sessions from localStorage", e);
      localStorage.removeItem('tachometerSessions');
    }
  }, []);

  const saveSessions = (updatedSessions: Session[]) => {
    setSessions(updatedSessions);
    localStorage.setItem('tachometerSessions', JSON.stringify(updatedSessions));
  };

  const handleEnter = () => {
    setAppStage('main');
  };
  
  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleDeviceSelect = (selectedDeviceId: string) => {
    setDeviceId(selectedDeviceId);
    setChartData([]);
    setCurrentSessionData([]);
    setIsDeviceOn(false);
    setConnectionStatus('disconnected');
    setError(null);
  };

  const handleToggleDevice = async (isOn: boolean) => {
    if (!deviceId || isTogglingDevice) return;

    setError(null);
    setIsTogglingDevice(true);

    try {
      await setDevicePowerState(deviceId, isOn);
      setIsDeviceOn(isOn);
      if (isOn) {
        // Start a new session
        setConnectionStatus('connecting');
        setCurrentSessionData([]);
        setChartData([]);
        setSessionStartTime(Date.now());
      } else {
        // End the current session
        setConnectionStatus('disconnected');
        if (sessionStartTime && currentSessionData.length > 1) {
          const endTime = Date.now();
          const rpms = currentSessionData.map(d => d.rpm);
          const newSession: Session = {
            id: `session_${sessionStartTime}`,
            startTime: sessionStartTime,
            endTime: endTime,
            duration: Math.round((endTime - sessionStartTime) / 1000),
            data: currentSessionData,
            avgRpm: Math.round(rpms.reduce((a, b) => a + b, 0) / rpms.length),
            maxRpm: Math.max(...rpms),
            minRpm: Math.min(...rpms),
          };
          saveSessions([newSession, ...sessions]);
        }
        setSessionStartTime(null);
      }
    } catch (error) {
      console.error("Failed to set device power state:", error);
      const errorMessage = 'Failed to toggle device power. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsTogglingDevice(false);
    }
  };
  
  const handleChangeDevice = () => {
    if (isDeviceOn) {
      handleToggleDevice(false);
    }
    setDeviceId(null);
    setChartData([]);
    setCurrentSessionData([]);
    setConnectionStatus('disconnected');
    setError(null);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (deviceId && isDeviceOn) {
      const dataCallback = (newDataChunk: TachometerDataPoint[]) => {
          if (connectionStatus !== 'connected') {
            setConnectionStatus('connected');
          }
          // Append new data to the full session log
          const updatedSessionData = [...currentSessionData, ...newDataChunk];
          setCurrentSessionData(updatedSessionData);
          
          // Update the rolling chart data (last 30 points)
          const newChartData = updatedSessionData.slice(-30);
          setChartData(newChartData);
      };

      unsubscribe = startDataStream(deviceId, dataCallback);
      
    } else {
      setChartData([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [deviceId, isDeviceOn, connectionStatus]);
  
  const renderContent = () => {
    if (showLanding) {
      return <LandingPage onGetStarted={handleGetStarted} />;
    }
  
    if (!deviceId) {
      return <DeviceSelector onDeviceSelect={handleDeviceSelect} />;
    }
  
    return <Dashboard 
      deviceId={deviceId} 
      chartData={chartData} 
      sessionData={currentSessionData}
      sessions={sessions}
      onSaveSessions={saveSessions}
      connectionStatus={connectionStatus}
      isDeviceOn={isDeviceOn}
      onChangeDevice={handleChangeDevice}
      onToggleDevice={handleToggleDevice}
      isTogglingDevice={isTogglingDevice}
      error={error}
    />;
  }

  if (appStage === 'splash') {
    return <SplashScreen onEnter={handleEnter} />;
  }

  return (
    <>
      <ParticlesBackground />
      <div className="relative z-10">
        {renderContent()}
      </div>
    </>
  )
};

export default App;