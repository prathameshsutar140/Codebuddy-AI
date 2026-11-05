import React, { useState } from 'react';
import {
  Bug,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  Play
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { DebugResult } from '../types';

interface DebuggingLabViewProps {
  onNavigateToPlayground?: (code: string, language: string) => void;
}

export const DebuggingLabView: React.FC<DebuggingLabViewProps> = ({ onNavigateToPlayground }) => {
  const [language, setLanguage] = useState('javascript');
  const [originalCode, setOriginalCode] = useState(`function calculateAverage(numbers) {
  let total = 0;
  for (let i = 0; i <= numbers.length; i++) {
    total += numbers[i];
  }
  return total / numbers.length;
}

const result = calculateAverage([10, 20, 30]);
console.log("Average:", result);`);

  const [errorMessage, setErrorMessage] = useState(`Average is returning NaN unexpectedly.`);
  const [loading, setLoading] = useState(false);
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [viewMode, setViewMode] = useState<'sideBySide' | 'correctedOnly'>('sideBySide');
  const [copied, setCopied] = useState(false);

  const handleDebug = async () => {
    if (!originalCode.trim() || loading) return;
    setLoading(true);
    setDebugResult(null);

    try {
      const res = await fetch('/api/ai/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: originalCode,
          error: errorMessage,
          language
        })
      });

      if (!res.ok) {
        throw new Error('Failed to debug code');
      }

      const data = await res.json();
      setDebugResult(data);
    } catch (err) {
      console.error('Debug error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = () => {
    if (debugResult?.correctedCode) {
      setOriginalCode(debugResult.correctedCode);
    }
  };

  const handleCopyCorrected = () => {
    if (debugResult?.correctedCode) {
      navigator.clipboard.writeText(debugResult.correctedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-400">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Debugging Lab</h1>
            <p className="text-xs text-slate-400">
              Diagnose runtime exceptions, logic flaws, off-by-one errors, and syntax bugs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
            <Code2 className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="javascript" className="bg-[#0f1422]">JavaScript</option>
              <option value="python" className="bg-[#0f1422]">Python</option>
              <option value="c" className="bg-[#0f1422]">C</option>
              <option value="cpp" className="bg-[#0f1422]">C++</option>
              <option value="java" className="bg-[#0f1422]">Java</option>
              <option value="sql" className="bg-[#0f1422]">SQL</option>
            </select>
          </div>

          <button
            onClick={handleDebug}
            disabled={loading || !originalCode.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Diagnosing...' : 'Find & Fix Bugs'}</span>
          </button>
        </div>
      </div>

      {/* Error Input Box */}
      <div className="p-4 rounded-xl bg-[#0b0e17] border border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Reported Error Message, Console Log, or Symptom (Optional):
        </label>
        <textarea
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
          placeholder="e.g., TypeError: Cannot read properties of undefined, or output returns NaN..."
          rows={2}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg p-2.5 text-xs text-rose-300 font-mono placeholder-slate-600 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Diagnostic Diagnosis Cards if available */}
      {debugResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/60">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Error Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{debugResult.errorSummary}</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/60">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Likely Cause</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{debugResult.likelyCause}</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Suggested Fix & Prevention</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-2">{debugResult.suggestedFix}</p>
            <p className="text-[11px] text-slate-400 italic">💡 {debugResult.preventionTip}</p>
          </div>
        </div>
      )}

      {/* Editor Views: Original vs Suggested Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Code */}
        <div className="rounded-2xl bg-[#0b0e17] border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#101422] border-b border-slate-800 text-xs">
            <span className="font-semibold text-slate-300">Original Source Code</span>
            <span className="text-[11px] text-slate-500">Editable</span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'c' || language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={originalCode}
              onChange={(val) => setOriginalCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                automaticLayout: true
              }}
            />
          </div>
        </div>

        {/* Suggested Corrected Code */}
        <div className="rounded-2xl bg-[#0b0e17] border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#101422] border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-400">Corrected Code</span>
              {debugResult && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Fixed
                </span>
              )}
            </div>

            {debugResult && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCorrected}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleApplyFix}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
                  title="Overwrite original editor with corrected code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Apply to Editor</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'c' || language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={
                debugResult?.correctedCode ||
                `// Corrected code will appear here after clicking "Find & Fix Bugs"`
              }
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                readOnly: true,
                automaticLayout: true
              }}
            />
          </div>

          {debugResult?.changesMade && (
            <div className="p-3 bg-[#0d121f] border-t border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Changes Made:</span>
              <ul className="list-disc pl-4 text-slate-300 space-y-0.5 mt-1 text-[11px]">
                {debugResult.changesMade.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
