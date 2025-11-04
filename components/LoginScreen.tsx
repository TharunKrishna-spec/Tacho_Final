import React, { useState } from 'react';
// FIX: The import for `auth` is commented out because `firebaseConfig.ts` is no longer a module, causing a build error. Firebase authentication has been removed from the project.
// import { auth } from '../firebaseConfig';
// FIX: Removed unused v9 style import from 'firebase/auth' as it is causing an error.
// The functionality will be accessed via a method on the auth object instead.
import { EngineIcon } from './icons/EngineIcon';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (email && password) {
      // FIX: Replaced Firebase authentication logic with a mock implementation as Firebase has been removed.
      // This now simulates a delay and shows an error message.
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('Login functionality has been disabled.');
      setIsLoading(false);
    } else {
      setError('Please enter both email and password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-navy-800 rounded-lg shadow-2xl">
        <div className="text-center">
            <EngineIcon className="w-16 h-16 mx-auto text-cyan mb-4" />
          <h1 className="text-3xl font-bold text-slate-100">Tachometer Monitor</h1>
          <p className="mt-2 text-slate-300">Sign in to access your device dashboard</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-navy-700 bg-navy-900 placeholder-slate-300 text-slate-100 rounded-t-md focus:outline-none focus:ring-cyan focus:border-cyan focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-navy-700 bg-navy-900 placeholder-slate-300 text-slate-100 rounded-b-md focus:outline-none focus:ring-cyan focus:border-cyan focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-navy-900 bg-cyan hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-800 focus:ring-cyan transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
       <div className="mt-8 text-center text-slate-300 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">About This Application</h2>
        <p className="text-sm">This dashboard is connected to a <span className="text-cyan font-mono">Firebase Realtime Database</span>. An ESP32-based tachometer can send data (RPM, timestamp) to this backend. This web app then fetches the data for the specified Device ID to provide real-time visualization and analysis.</p>
        <p className="text-sm mt-2">To use this app, add a user in the Firebase Authentication console and ensure your hardware is sending data to the Realtime Database.</p>
       </div>
    </div>
  );
};

export default LoginScreen;