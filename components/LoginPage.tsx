
import React, { useState } from 'react';
import { COMPANY_LOGO_URL, COMPANY_NAME } from '../constants.ts';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void; // Updated prop type
  onNavigateToHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) { // Accept any non-empty username/password
      setError('');
      onLoginSuccess(username.trim()); // Pass the username
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#EBF4FF] to-[#D6E4FF] dark:from-[#010F29] dark:to-[#021B4D]">
      <div className="w-full max-w-md bg-white dark:bg-[#021B4D] p-8 rounded-xl shadow-2xl border border-[#A8C5FF] dark:border-[#0336FF]">
        <div className="text-center mb-8">
          <img src={COMPANY_LOGO_URL} alt={`${COMPANY_NAME} Logo`} className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-[#0336FF] dark:border-[#FFDE03]" />
          <h1 className="text-2xl font-bold text-[#0058e0] dark:text-[#FFDE03]">{COMPANY_NAME}</h1>
          <p className="text-[#5C8AFF] dark:text-[#A8C5FF]">AI Support Portal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-[#02288C] dark:text-[#A8C5FF] mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-[#A8C5FF] dark:border-[#0336FF] rounded-lg 
                         text-[#010F29] dark:text-[#F0F0F0] bg-white dark:bg-[#02288C]
                         focus:ring-2 focus:ring-[#0336FF] dark:focus:ring-[#FFDE03]
                         focus:border-transparent dark:focus:border-transparent outline-none transition duration-150 ease-in-out"
              placeholder="Enter any username"
              aria-describedby="username-hint"
            />
            <p id="username-hint" className="sr-only">Enter any username for the demo session.</p>
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-[#02288C] dark:text-[#A8C5FF] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#A8C5FF] dark:border-[#0336FF] rounded-lg 
                         text-[#010F29] dark:text-[#F0F0F0] bg-white dark:bg-[#02288C]
                         focus:ring-2 focus:ring-[#0336FF] dark:focus:ring-[#FFDE03]
                         focus:border-transparent dark:focus:border-transparent outline-none transition duration-150 ease-in-out"
              placeholder="Enter any password"
              aria-describedby="password-hint"
            />
             <p id="password-hint" className="sr-only">Enter any password for the demo session.</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center" role="alert">
              {error}
            </p>
          )}
          
          {/* Removed informational text: 
          <p className="text-xs text-center text-[#02288C] dark:text-[#A8C5FF]">
            For demo purposes, you can enter any username and password.
          </p> 
          */}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#0336FF] hover:bg-[#02288C] text-white 
                       dark:bg-[#FFDE03] dark:hover:bg-[#E6C600] dark:text-[#0336FF] 
                       rounded-lg font-semibold text-lg
                       focus:outline-none focus:ring-4 focus:ring-[#5C8AFF] dark:focus:ring-[#0336FF]
                       transition duration-300 ease-in-out shadow-md"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
            <button 
                onClick={onNavigateToHome}
                className="text-sm text-[#0058e0] dark:text-[#FFDE03] hover:underline"
            >
                Return to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
