import React, { useState } from 'react';
import {
  FileCode2,
  Sparkles,
  Sliders,
  Code2,
  Clock,
  Layers,
  ArrowRight,
  Lightbulb,
  Check,
  Copy,
  Table,
  Play
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodeExplanation, ExperienceLevel } from '../types';

export const CodeExplainerView: React.FC = () => {
  const [language, setLanguage] = useState('javascript');
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [code, setCode] = useState(`function mergeSortedArrays(arr1, arr2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  return result.concat(arr1.slice(i)).concat(arr2.slice(j));
}`);

  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lineByLine' | 'variables' | 'complexity'>('overview');

  const handleExplain = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, level })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to explain code');
      }

      const data = await res.json();
      setExplanation(data);
    } catch (err: unknown) {
      console.error('Explainer error:', err);
      setError(err instanceof Error ? err.message : 'Error analyzing code');
    } finally {
      setLoading(false);
    }
  };

  const samplePresets: Record<string, string> = {
    c: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("%d\\n", factorial(5));
    return 0;
}`,
    python: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    javascript: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    sql: `SELECT 
    department_id,
    AVG(salary) AS avg_sal,
    COUNT(*) AS total_employees
FROM employees
WHERE is_active = 1
GROUP BY department_id
HAVING AVG(salary) > 75000;`
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Code Explainer</h1>
              <p className="text-xs text-slate-400">
                Understand algorithms, line-by-line mechanics, variable roles, and Big-O complexity
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                if (samplePresets[newLang]) {
                  setCode(samplePresets[newLang]);
                }
              }}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="javascript" className="bg-[#0f1422]">JavaScript</option>
              <option value="python" className="bg-[#0f1422]">Python</option>
              <option value="c" className="bg-[#0f1422]">C</option>
              <option value="cpp" className="bg-[#0f1422]">C++</option>
              <option value="java" className="bg-[#0f1422]">Java</option>
              <option value="html" className="bg-[#0f1422]">HTML</option>
              <option value="css" className="bg-[#0f1422]">CSS</option>
              <option value="sql" className="bg-[#0f1422]">SQL</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="beginner" className="bg-[#0f1422]">Beginner Level</option>
              <option value="intermediate" className="bg-[#0f1422]">Intermediate Level</option>
              <option value="advanced" className="bg-[#0f1422]">Advanced Level</option>
            </select>
          </div>

          <button
            onClick={handleExplain}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analyzing...' : 'Explain Code'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Editor & Explanation Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Monaco Code Editor */}
        <div className="rounded-2xl bg-[#0b0e17] border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[600px]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#101422] border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="text-slate-300 font-medium">Source Code Input</span>
            <span className="capitalize text-blue-400">{language}</span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'c' || language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>
        </div>

        {/* Right: Explanation Cards Pane */}
        <div className="rounded-2xl bg-[#0d121f] border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[600px]">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 bg-[#101422] border-b border-slate-800 text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview & Logic
            </button>
            <button
              onClick={() => setActiveTab('lineByLine')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'lineByLine'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Line-by-Line
            </button>
            <button
              onClick={() => setActiveTab('variables')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'variables'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Variables & Functions
            </button>
            <button
              onClick={() => setActiveTab('complexity')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'complexity'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Complexity & I/O
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-800 space-y-4">
            {!explanation && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Sparkles className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                <p className="text-sm font-semibold text-slate-300">Ready to Analyze</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Paste or write any code snippet on the left and click "Explain Code" to generate comprehensive pedagogical insights.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3" />
                <p className="text-xs font-mono">Analyzing algorithmic execution with Gemini 3.8...</p>
              </div>
            )}

            {explanation && !loading && (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                        Code Overview
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed">{explanation.overview}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Logic Execution Steps
                      </h4>
                      <div className="space-y-2">
                        {explanation.logicSteps?.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {explanation.improvementTips && explanation.improvementTips.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1.5">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Code Improvement & Best Practices</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                          {explanation.improvementTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'lineByLine' && (
                  <div className="space-y-2.5">
                    {explanation.lineByLine?.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                        <span className="font-mono text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-[10px]">
                          Lines {item.lines}
                        </span>
                        <p className="text-slate-300 mt-2 leading-relaxed">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'variables' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Variables Identified
                      </h4>
                      <div className="space-y-2">
                        {explanation.variables?.map((v, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-start justify-between gap-4">
                            <div>
                              <span className="font-mono text-blue-400 font-semibold">{v.name}</span>
                              <span className="text-[10px] text-slate-500 ml-2">({v.type})</span>
                              <p className="text-slate-300 mt-1">{v.purpose}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {explanation.functions && explanation.functions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Functions
                        </h4>
                        <div className="space-y-2">
                          {explanation.functions?.map((f, i) => (
                            <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                              <span className="font-mono text-emerald-400 font-semibold">{f.name}({f.parameters})</span>
                              <span className="text-slate-500 ml-2 text-[10px]">➔ returns {f.returns}</span>
                              <p className="text-slate-300 mt-1">{f.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'complexity' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Time Complexity</span>
                        <p className="text-sm font-bold font-mono text-purple-400 mt-1">{explanation.timeComplexity}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Space Complexity</span>
                        <p className="text-sm font-bold font-mono text-blue-400 mt-1">{explanation.spaceComplexity}</p>
                      </div>
                    </div>

                    {explanation.sampleInputOutput && (
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Sample Run</span>
                        <div className="p-2 rounded bg-black/50 font-mono text-slate-300">
                          <span className="text-slate-500">Input: </span>{explanation.sampleInputOutput.sampleInput}
                        </div>
                        <div className="p-2 rounded bg-black/50 font-mono text-emerald-400">
                          <span className="text-slate-500">Output: </span>{explanation.sampleInputOutput.sampleOutput}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
