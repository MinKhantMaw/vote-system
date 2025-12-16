import React, { useState, useEffect } from 'react';
import { VOTERS, Vote } from './types';
import { VotingCard } from './components/VotingCard';
import { ResultsView } from './components/ResultsView';
import { LoginView } from './components/LoginView';
import { Vote as VoteIcon, LogOut } from 'lucide-react';

export default function App() {
  // Load state from localStorage or set defaults
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cv_auth') === 'true';
  });

  const [currentVoterIndex, setCurrentVoterIndex] = useState<number>(() => {
    const saved = localStorage.getItem('cv_voterIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [votes, setVotes] = useState<Vote[]>(() => {
    const saved = localStorage.getItem('cv_votes');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFinished, setIsFinished] = useState<boolean>(() => {
    return localStorage.getItem('cv_finished') === 'true';
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('cv_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('cv_voterIndex', String(currentVoterIndex));
    localStorage.setItem('cv_votes', JSON.stringify(votes));
    localStorage.setItem('cv_finished', String(isFinished));
  }, [currentVoterIndex, votes, isFinished]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // We intentionally don't clear the votes on logout so data persists across sessions
    // localStorage.removeItem('cv_votes'); 
  };

  const handleVote = (candidateId: string) => {
    const currentVoter = VOTERS[currentVoterIndex];
    
    const newVote: Vote = {
      voterId: currentVoter.id,
      votedForId: candidateId
    };

    setVotes([...votes, newVote]);

    if (currentVoterIndex < VOTERS.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setVotes([]);
    setCurrentVoterIndex(0);
    setIsFinished(false);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                <VoteIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Onenex Voting System</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!isFinished && (
              <div className="text-sm font-medium text-slate-500 hidden sm:block bg-slate-100 px-3 py-1 rounded-full">
                Voter {currentVoterIndex + 1} of {VOTERS.length}
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-50"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 space-y-12">
        {!isFinished && (
          <div className="w-full flex justify-center animate-in fade-in zoom-in duration-300">
            <VotingCard
              currentVoter={VOTERS[currentVoterIndex]}
              onVote={handleVote}
              progress={currentVoterIndex + 1}
              totalSteps={VOTERS.length}
            />
          </div>
        )}

        <ResultsView 
            votes={votes} 
            onReset={handleReset} 
            isLive={!isFinished}
        />
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© 2025 Onenex Voting System. All rights reserved.</p>
      </footer>
    </div>
  );
}