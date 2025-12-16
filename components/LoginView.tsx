import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 mb-4 shadow-lg ring-4 ring-indigo-400/50">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Access</h1>
          <p className="text-indigo-200 mt-2 text-sm">Please login to access the voting system</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
                  placeholder="Enter username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
            >
              Sign In <LogIn className="w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400">Onenex Voting Secure System © 2025</p>
        </div>
      </div>
    </div>
  );
};