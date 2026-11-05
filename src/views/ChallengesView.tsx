import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  Code2,
  ChevronRight,
  ArrowLeft,
  Terminal,
  AlertCircle
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { CHALLENGES } from '../data/challengesData';
import { Challenge } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ChallengesViewProps {
  initialChallengeId?: string;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ initialChallengeId }) => {
  const { user } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    CHALLENGES.find((c) => c.id === initialChallengeId) || null
  );

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');
  const [sourceCode, setSourceCode] = useState(selectedChallenge?.starterCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{ input: string; expected: string; actual: string; passed: boolean }> | null
  >(null);
  const [showHints, setShowHints] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set(['fizz-buzz']));
  const [executionOutput, setExecutionOutput] = useState('');
  const [executionErrors, setExecutionErrors] = useState('');

  const categories = ['All', 'Arrays', 'Strings', 'Loops', 'Algorithms', 'Data structures'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredChallenges = CHALLENGES.filter((c) => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchDiff = activeDifficulty === 'All' || c.difficulty === activeDifficulty;
    return matchCat && matchDiff;
  });

  const handleSelectChallenge = (c: Challenge) => {
    setSelectedChallenge(c);
    setSourceCode(c.starterCode);
    setTestResults(null);
    setExecutionOutput('');
    setExecutionErrors('');
    setShowHints(false);
  };

  const handleRunTests = async () => {
    if (!selectedChallenge || isRunning) return;
    setIsRunning(true);
    setTestResults(null);
    setExecutionOutput('');
    setExecutionErrors('');

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: sourceCode,
          language: selectedChallenge.language,
          testCases: selectedChallenge.testCases
        })
      });

      const data = await res.json();
      setExecutionOutput(data.output || '');
      setExecutionErrors(data.errors || '');

      if (data.testResults && data.testResults.length > 0) {
        setTestResults(data.testResults);
        const allPassed = data.testResults.every((t: { passed: boolean }) => t.passed);
        if (allPassed) {
          setSolvedChallenges((prev) => new Set(prev).add(selectedChallenge.id));
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Save submission to Firestore
          if (user) {
            try {
              await addDoc(collection(db, 'challengeSubmissions'), {
                userId: user.uid,
                challengeId: selectedChallenge.id,
                sourceCode,
                language: selectedChallenge.language,
                status: 'passed',
                executionTimeMs: data.executionTimeMs || 0,
                testsPassed: data.testResults.length,
                totalTests: data.testResults.length,
                submittedAt: new Date().toISOString()
              });
            } catch (saveErr) {
              console.warn('Failed to save submission:', saveErr);
            }
          }
        }
      }
    } catch (err: unknown) {
      setExecutionErrors(err instanceof Error ? err.message : 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {selectedChallenge ? (
        /* Problem Solver Workspace */
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Challenges</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">{selectedChallenge.title}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedChallenge.difficulty === 'Easy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : selectedChallenge.difficulty === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {selectedChallenge.difficulty}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[calc(100vh-10rem)]">
            {/* Left: Problem Spec, Constraints, Hints */}
            <div className="rounded-2xl bg-[#0f1422] border border-slate-800 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              <div>
                <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">
                  {selectedChallenge.category}
                </span>
                <h1 className="text-xl font-extrabold text-white mt-1">
                  {selectedChallenge.title}
                </h1>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                <p className="whitespace-pre-line">{selectedChallenge.description}</p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-200">Input Format:</h4>
                  <p className="text-slate-400 font-mono text-[11px]">{selectedChallenge.inputFormat}</p>
                  <h4 className="text-[11px] font-bold text-slate-200">Output Format:</h4>
                  <p className="text-slate-400 font-mono text-[11px]">{selectedChallenge.outputFormat}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-[11px] font-bold text-slate-200 mb-1">Constraints:</h4>
                  <pre className="text-slate-400 font-mono text-[11px] whitespace-pre-wrap">
                    {selectedChallenge.constraints}
                  </pre>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-200">Sample Example:</h4>
                  <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-slate-300">
                    <span className="text-slate-500">Input: </span>{selectedChallenge.sampleInput}
                  </div>
                  <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-400">
                    <span className="text-slate-500">Output: </span>{selectedChallenge.sampleOutput}
                  </div>
                </div>

                {/* Hints Toggle */}
                <div>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHints ? 'Hide Hints' : 'Need a Hint?'}</span>
                  </button>

                  {showHints && (
                    <div className="mt-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 space-y-1.5 animate-in fade-in">
                      {selectedChallenge.hints.map((hint, idx) => (
                        <p key={idx}>💡 {hint}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Monaco Editor & Test Runner Results */}
            <div className="flex flex-col rounded-2xl bg-[#0b0e17] border border-slate-800 overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#101422] border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-slate-200">Solution Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSourceCode(selectedChallenge.starterCode)}
                    className="p-1 rounded text-slate-400 hover:text-slate-200"
                    title="Reset starter code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition disabled:opacity-50 text-xs shadow-md shadow-emerald-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRunning ? 'Evaluating...' : 'Run Test Suite'}</span>
                  </button>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={selectedChallenge.language}
                  theme="vs-dark"
                  value={sourceCode}
                  onChange={(v) => setSourceCode(v || '')}
                  options={{ minimap: { enabled: false }, fontSize: 13 }}
                />
              </div>

              {/* Test Cases Results Pane */}
              <div className="h-44 border-t border-slate-800 bg-[#0d121f] p-3 overflow-y-auto space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-bold uppercase tracking-wider">Test Suite Verification</span>
                  {testResults && (
                    <span
                      className={`font-semibold ${
                        testResults.every((t) => t.passed) ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {testResults.filter((t) => t.passed).length} / {testResults.length} Passed
                    </span>
                  )}
                </div>

                {executionErrors && (
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-800 text-rose-300">
                    <span className="font-bold">Error: </span>
                    {executionErrors}
                  </div>
                )}

                {testResults ? (
                  <div className="space-y-1.5">
                    {testResults.map((tc, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                          tc.passed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {tc.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span>Test Case #{idx + 1}: input ({tc.input})</span>
                        </div>
                        <div className="text-[10px] text-right font-mono">
                          {tc.passed ? (
                            <span className="text-emerald-400 font-bold">Passed</span>
                          ) : (
                            <span className="text-rose-400">
                              Expected: {tc.expected} | Got: {tc.actual}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isRunning && (
                    <p className="text-slate-500 italic text-[11px]">
                      Click "Run Test Suite" to execute real test inputs against your code.
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Challenges List View */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121829] to-[#0f172a] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-1 text-xs font-semibold">
                <Trophy className="w-4 h-4" />
                <span>Practice Arena</span>
              </div>
              <h1 className="text-xl font-bold text-white">Coding Practice Challenges</h1>
              <p className="text-xs text-slate-400 max-w-xl mt-1">
                Solve real algorithmic and data structure problems. Code is validated against genuine test cases.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    activeCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    activeDifficulty === diff
                      ? 'bg-slate-800 text-white border border-slate-600'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Challenges Table / Grid */}
          <div className="grid grid-cols-1 gap-3">
            {filteredChallenges.map((challenge) => {
              const isSolved = solvedChallenges.has(challenge.id);
              return (
                <div
                  key={challenge.id}
                  onClick={() => handleSelectChallenge(challenge)}
                  className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 hover:border-purple-500/40 transition cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSolved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isSolved ? <CheckCircle2 className="w-5 h-5" /> : <Code2 className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition">
                          {challenge.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            challenge.difficulty === 'Easy'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : challenge.difficulty === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-xl">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                      {challenge.testCases.length} Test cases
                    </span>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-purple-600 text-slate-300 group-hover:text-white text-xs font-semibold transition flex items-center gap-1">
                      <span>{isSolved ? 'Review' : 'Solve'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
