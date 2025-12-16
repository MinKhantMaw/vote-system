import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Vote, CANDIDATES, GROUP_IMAGES, VOTERS, VoterType } from '../types';
import { RotateCcw, Trophy, Activity, Timer, Crown, Medal, Star } from 'lucide-react';

interface ResultsViewProps {
  votes: Vote[];
  onReset: () => void;
  isLive?: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ votes, onReset, isLive = false }) => {
  // Calculate results with tie-breaker logic
  const results = CANDIDATES.map(candidateId => {
    const candidateVotes = votes.filter(v => v.votedForId === candidateId);
    const total = candidateVotes.length;
    
    // Count votes from GUESS type voters for tie-breaking
    const guestVotes = candidateVotes.filter(v => {
      const voter = VOTERS.find(u => u.id === v.voterId);
      return voter?.type === VoterType.GUESS;
    }).length;

    return {
      name: candidateId,
      votes: total,
      guestVotes,
      voters: candidateVotes.map(v => v.voterId)
    };
  });

  // Sort: Primary by Total Votes, Secondary by Guest Votes
  const sortedResults = [...results].sort((a, b) => {
    // Primary: Total Votes
    if (b.votes !== a.votes) return b.votes - a.votes;
    // Secondary: Guest Votes (Tie-breaker)
    return b.guestVotes - a.guestVotes;
  });

  const top3 = sortedResults.slice(0, 3);
  const totalVotes = votes.length;
  
  // Podium re-ordering for display: 2nd, 1st, 3rd
  const podiumOrder = [
    top3[1], // 2nd
    top3[0], // 1st
    top3[2]  // 3rd
  ].filter(Boolean); // Remove undefined if less than 3 candidates

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className={`bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden transition-colors duration-500 ${isLive ? 'ring-2 ring-indigo-50 border-indigo-100' : ''}`}>
        <div className={`p-8 text-white text-center transition-colors duration-500 ${isLive ? 'bg-indigo-600' : 'bg-slate-900'}`}>
            <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${isLive ? 'bg-white/20' : 'bg-yellow-500/20'}`}>
                {isLive ? (
                   <Activity className="h-8 w-8 text-white animate-pulse" />
                ) : (
                   <Trophy className="h-8 w-8 text-yellow-400" />
                )}
            </div>
          <h2 className="text-3xl font-black uppercase tracking-wider mb-2">
            {isLive ? 'Live Ranking' : 'Winners Podium'}
          </h2>
          <p className={`${isLive ? 'text-indigo-200' : 'text-slate-400'}`}>
            {isLive ? 'Real-time voting updates' : 'Official Results'}
          </p>
        </div>

        <div className="p-8 bg-slate-50/50">
            {/* Podium Section */}
            {totalVotes === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-400">
                    <Timer className="h-12 w-12 mb-3 opacity-50" />
                    <h3 className="text-xl font-medium">Waiting for votes...</h3>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-12 min-h-[300px]">
                  {/* Mobile View: Just map strictly 1, 2, 3. Desktop: Use podiumOrder (2, 1, 3) */}
                  {(window.innerWidth < 768 ? top3 : podiumOrder).map((result, index) => {
                     // Determine actual rank based on sortedResults
                     const rank = sortedResults.indexOf(result);
                     const isFirst = rank === 0;
                     const isSecond = rank === 1;
                     const isThird = rank === 2;
                     
                     // Tie-Breaker Logic:
                     // Check if this candidate tied in total votes with the candidate directly below them.
                     // If they did, and they are ranked higher (which they are, by index), it means the Tie-Breaker (Guest Votes) logic won.
                     const nextRankCandidate = sortedResults[rank + 1];
                     const isTieBreakerWinner = nextRankCandidate && 
                                                result.votes === nextRankCandidate.votes && 
                                                result.guestVotes >= nextRankCandidate.guestVotes;

                     if (!result || result.votes === 0) return null;

                     let heightClass = 'h-40';
                     let colorClass = 'bg-white border-slate-200';
                     let rankLabel = 'Winner';
                     let icon = null;
                     
                     if (isFirst) {
                       heightClass = 'h-64 order-1 md:order-2';
                       colorClass = 'bg-gradient-to-b from-yellow-50 to-white border-yellow-200 shadow-yellow-100';
                       rankLabel = '1st Place';
                       icon = <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />;
                     } else if (isSecond) {
                       heightClass = 'h-52 order-2 md:order-1';
                       colorClass = 'bg-gradient-to-b from-slate-50 to-white border-slate-300 shadow-slate-200';
                       rankLabel = '2nd Place';
                       icon = <Medal className="w-6 h-6 text-slate-400 fill-slate-300" />;
                     } else if (isThird) {
                       heightClass = 'h-48 order-3 md:order-3';
                       colorClass = 'bg-gradient-to-b from-orange-50 to-white border-orange-200 shadow-orange-100';
                       rankLabel = '3rd Place';
                       icon = <Medal className="w-6 h-6 text-orange-400 fill-orange-300" />;
                     }

                     return (
                       <div 
                        key={result.name} 
                        className={`relative w-full md:w-1/3 flex flex-col items-center justify-end rounded-t-2xl border-x border-t ${colorClass} shadow-lg transition-all duration-500 ${heightClass} pb-4 animate-in slide-in-from-bottom-10 fade-in`}
                       >
                          {/* Floating Image */}
                          <div className={`absolute -top-12 md:-top-16 perspective-container ${isFirst ? 'w-24 h-24 md:w-32 md:h-32' : 'w-20 h-20 md:w-24 md:h-24'}`}>
                             <div className={`card-3d-wrapper w-full h-full rounded-full border-4 shadow-md bg-white ${isFirst ? 'border-yellow-400 ring-4 ring-yellow-100' : isSecond ? 'border-slate-300' : 'border-orange-300'}`}>
                                 <img 
                                   src={GROUP_IMAGES[result.name]} 
                                   alt={result.name} 
                                   className="w-full h-full rounded-full object-cover"
                                 />
                             </div>
                             {isFirst && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-400 rounded-full blur-2xl opacity-20 -z-10 animate-pulse"></div>}
                             
                             {/* Tie Breaker Badge */}
                             {isTieBreakerWinner && (
                                <div className="absolute -right-6 top-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white transform rotate-12 z-20 flex items-center gap-1 animate-in zoom-in duration-300">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Guest Choice
                                </div>
                             )}
                          </div>

                          <div className="mt-16 text-center z-10 w-full px-2">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                {icon}
                              </div>
                              <h3 className={`font-black ${isFirst ? 'text-2xl md:text-3xl' : 'text-xl'} text-slate-800`}>{result.name}</h3>
                              <div className="flex flex-col items-center gap-1 justify-center mt-1">
                                <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-sm">
                                  {result.votes} Votes
                                </span>
                                
                                {/* Show guest votes if helpful for context */}
                                {result.guestVotes > 0 && (
                                  <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isTieBreakerWinner ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-400 bg-white/50'}`}>
                                    +{result.guestVotes} Guest Votes
                                  </div>
                                )}
                              </div>
                          </div>
                       </div>
                     );
                  })}
                </div>
            )}

            <div className="h-px bg-slate-200 w-full mb-10"></div>

            {/* Chart */}
          <div className="h-64 w-full mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedResults} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                />
                <YAxis 
                    allowDecimals={false} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="votes" radius={[8, 8, 0, 0]} barSize={40} animationDuration={500}>
                  {sortedResults.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#fb923c' : '#cbd5e1'} 
                        className="transition-all duration-500"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Grouped List */}
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Full Ranking & Details
          </h3>
          
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
             {sortedResults.map((entry, index) => {
                 const rank = index + 1;
                 const isWinner = index === 0 && entry.votes > 0;
                 
                 // Tie Logic for List View
                 const nextEntry = sortedResults[index + 1];
                 const isTieBreakerWinner = nextEntry && 
                                            entry.votes === nextEntry.votes && 
                                            entry.guestVotes >= nextEntry.guestVotes;

                 return (
                     <div key={entry.name} className={`flex flex-col bg-white rounded-xl border ${isWinner ? 'border-yellow-300 ring-1 ring-yellow-200 shadow-yellow-100' : isTieBreakerWinner ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200'} shadow-sm overflow-hidden transition-all hover:shadow-md`}>
                         <div className={`px-4 py-3 border-b ${isWinner ? 'bg-yellow-50/50' : 'bg-slate-50/50'} flex justify-between items-center`}>
                             <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${rank === 1 ? 'bg-yellow-400 text-white' : rank === 2 ? 'bg-slate-300 text-white' : rank === 3 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {rank}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-bold ${isWinner ? 'text-slate-800' : 'text-slate-700'}`}>{entry.name}</span>
                                    {isTieBreakerWinner && <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1"><Star className="w-2 h-2 fill-indigo-600" /> Guest Preference</span>}
                                </div>
                             </div>
                             <div className="flex flex-col items-end">
                                <span className="font-bold text-slate-800">{entry.votes} Votes</span>
                                {entry.guestVotes > 0 && <span className={`text-[10px] ${isTieBreakerWinner ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>({entry.guestVotes} from Guests)</span>}
                             </div>
                         </div>
                         <div className="p-3 flex-1 bg-white">
                            {entry.voters.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {entry.voters.map((voter, idx) => {
                                      const isGuest = VOTERS.find(v => v.id === voter)?.type === VoterType.GUESS;
                                      return (
                                        <span key={idx} className={`inline-block px-2 py-0.5 border rounded text-[10px] font-medium ${isGuest ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                            {voter}
                                        </span>
                                      );
                                    })}
                                </div>
                            ) : (
                                <span className="text-xs text-slate-300 italic">No votes</span>
                            )}
                         </div>
                     </div>
                 );
             })}
          </div>

        </div>
        
        {!isLive && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-center rounded-b-3xl">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                    <RotateCcw className="h-4 w-4" /> Start New Session
                </button>
            </div>
        )}
      </div>
    </div>
  );
};