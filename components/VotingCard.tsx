import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Voter, VoterType, CANDIDATES, GROUP_IMAGES } from "../types";
import { CheckCircle2, User, AlertCircle } from "lucide-react";

interface VotingCardProps {
  currentVoter: Voter;
  onVote: (candidateId: string) => void;
  progress: number;
  totalSteps: number;
}

export const VotingCard: React.FC<VotingCardProps> = ({
  currentVoter,
  onVote,
  progress,
  totalSteps,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Reset selection and modal when voter changes
  useEffect(() => {
    setSelectedCandidate("");
    setShowConfirmation(false);
  }, [currentVoter]);

  const handleVoteClick = () => {
    if (selectedCandidate) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmVote = () => {
    onVote(selectedCandidate);
    setShowConfirmation(false);
  };

  const currentVoterImage = GROUP_IMAGES[currentVoter.id];

  return (
    <>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-visible border border-slate-100 transition-all duration-300">
        <div className="bg-indigo-600 p-6 text-white rounded-t-2xl relative z-10 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {currentVoterImage ? (
                <div className="perspective-container w-12 h-12 flex-shrink-0">
                  <div className="card-3d-wrapper w-full h-full rounded-full border-2 border-indigo-300">
                    <img
                      src={currentVoterImage}
                      alt={currentVoter.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-400">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div className="flex flex-col">
                <span>{currentVoter.name}</span>
                <span className="text-xs font-normal text-indigo-200">
                  Voting Session
                </span>
              </div>
            </h2>
            <span
              key={progress}
              className="text-sm font-medium bg-indigo-500/50 px-3 py-1 rounded-full self-start sm:self-center whitespace-nowrap animate-in fade-in zoom-in duration-300"
            >
              Step {progress} of {totalSteps}
            </span>
          </div>
          <p className="text-indigo-100 ml-1 mt-2">
            Please select a group to cast your vote.
          </p>
        </div>

        <div className="p-6 bg-white rounded-b-2xl relative z-0">
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
              {CANDIDATES.map((candidate) => {
                const isSelf =
                  currentVoter.type === VoterType.GROUP &&
                  currentVoter.id === candidate;
                const isSelected = selectedCandidate === candidate;

                return (
                  <button
                    key={candidate}
                    onClick={() => !isSelf && setSelectedCandidate(candidate)}
                    disabled={isSelf}
                    className={`
                      relative w-full flex flex-col items-center p-4 rounded-xl transition-all duration-300 border-2
                      ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/50 shadow-lg scale-105 z-10"
                          : isSelf
                          ? "border-slate-100 bg-slate-50 opacity-50 grayscale cursor-not-allowed"
                          : "border-transparent hover:bg-slate-50 hover:border-slate-200 cursor-pointer"
                      }
                    `}
                  >
                    <div
                      className={`perspective-container w-24 h-24 sm:w-28 sm:h-28 mb-4 ${
                        isSelf ? "pointer-events-none" : ""
                      }`}
                    >
                      <div
                        className={`card-3d-wrapper w-full h-full rounded-2xl shadow-md bg-white ${
                          isSelected ? "ring-4 ring-indigo-200" : ""
                        }`}
                      >
                        <img
                          src={GROUP_IMAGES[candidate]}
                          alt={candidate}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      </div>
                    </div>

                    <span
                      className={`font-bold text-base ${
                        isSelected ? "text-indigo-700" : "text-slate-700"
                      }`}
                    >
                      {candidate}
                    </span>

                    {isSelf && (
                      <span className="text-xs text-slate-400 mt-1 font-medium">
                        (Your Group)
                      </span>
                    )}

                    {isSelected && (
                      <div className="absolute top-3 right-3 text-indigo-600 bg-white rounded-full shadow-md animate-in zoom-in duration-200">
                        <CheckCircle2 className="w-6 h-6 fill-indigo-50" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              *{" "}
              {currentVoter.type === VoterType.GROUP
                ? "You cannot vote for your own group."
                : "You can vote for any group."}
            </p>
          </div>

          <button
            onClick={handleVoteClick}
            disabled={!selectedCandidate}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-lg font-bold transition-all duration-200 transform
              ${
                selectedCandidate
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 -translate-y-0.5"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            Review Vote <CheckCircle2 className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400 rounded-b-2xl">
          Onenex Voting System - Official Balloting System
        </div>
      </div>

      {showConfirmation &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
              <div className="flex flex-col items-center text-center space-y-4">
                {GROUP_IMAGES[selectedCandidate] ? (
                  <div className="perspective-container w-24 h-24">
                    <div className="card-3d-wrapper w-full h-full rounded-full border-4 border-indigo-100 shadow-sm bg-white">
                      <img
                        src={GROUP_IMAGES[selectedCandidate]}
                        alt={selectedCandidate}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-indigo-600" />
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Confirm Your Vote
                  </h3>
                  <p className="text-slate-500">
                    Are you sure you want to vote for <br />
                    <span className="font-bold text-indigo-600 text-lg">
                      {selectedCandidate}
                    </span>
                    ?
                  </p>
                </div>

                <div className="flex gap-3 w-full pt-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmVote}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
