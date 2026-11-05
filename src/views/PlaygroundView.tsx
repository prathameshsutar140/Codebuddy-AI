import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Download,
  BookmarkPlus,
  Terminal,
  Eye,
  Check,
  Clock,
  AlertCircle,
  FileCode,
  Save,
  X
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const PlaygroundView: React.FC = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// CodeBuddy Interactive Sandbox
function solveProblem() {
  console.log("Starting algorithmic pipeline...");
  const primes = [2, 3, 5, 7, 11, 13, 17, 19];
  const squares = primes.map(p => p * p);
  console.log("Primes:", primes);
  console.log("Prime Squares:", squares);
  return "Completed successfully!";
}

solveProblem();`);

  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>('console');
  const [copied, setCopied] = useState(false);

  // Save Modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('My Playground Snippet');
  const [snippetDescription, setSnippetDescription] = useState('');
  const [snippetTags, setSnippetTags] = useState('algorithms, test');
  const [savingSnippet, setSavingSnippet] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const presets: Record<string, string> = {
    javascript: `// JavaScript isolated execution
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10) =", fibonacci(10));`,
    python: `# Python evaluation
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

data = [3, 6, 8, 10, 1, 2, 1]
print("Sorted:", quicksort(data))`,
    c: `#include <stdio.h>

int main() {
    int sum = 0;
    for(int i = 1; i <= 10; i++) {
        sum += i;
    }
    printf("Sum 1..10 = %d\\n", sum);
    return 0;
}`,
    cpp: `#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int total = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Vector sum: " << total << std::endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java execution on CodeBuddy AI");
        for (int i = 1; i <= 3; i++) {
            System.out.println("Iteration: " + i);
        }
    }
}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0f1422; color: #fff; padding: 20px; }
    .badge { background: #8b5cf6; padding: 6px 12px; border-radius: 6px; display: inline-block; font-weight: bold; }
  </style>
</head>
<body>
  <div class="badge">CodeBuddy Live Web Preview</div>
  <h2>Interactive Frontend Component</h2>
  <p>HTML & CSS updates reflect instantly in the Live Preview tab!</p>
</body>
</html>`,
    sql: `-- SQL Sandbox Query
SELECT 
    language,
    COUNT(*) AS total_snippets,
    AVG(duration) AS avg_duration_mins
FROM code_sessions
GROUP BY language
ORDER BY total_snippets DESC;`
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (presets[newLang]) {
      setCode(presets[newLang]);
    }
    if (newLang === 'html') {
      setActiveTab('preview');
    } else {
      setActiveTab('console');
    }
  };

  const handleRun = async () => {
    if (!code.trim() || isRunning) return;
    setIsRunning(true);
    setOutput('');
    setErrors('');
    setExecutionTime(null);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });

      const data = await res.json();
      setOutput(data.output || '(No standard output generated)');
      setErrors(data.errors || '');
      setExecutionTime(data.executionTimeMs ?? 0);
      if (language !== 'html') {
        setActiveTab('console');
      }
    } catch (err: unknown) {
      setErrors(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      c: 'c',
      cpp: 'cpp',
      java: 'java',
      html: 'html',
      sql: 'sql'
    };
    const ext = extMap[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground_${language}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to save code snippets to your account library.');
      return;
    }

    setSavingSnippet(true);
    try {
      const tagsArray = snippetTags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8);

      const snippetData = {
        userId: user.uid,
        title: snippetTitle.trim() || 'Untitled Snippet',
        description: snippetDescription.trim(),
        language,
        sourceCode: code,
        tags: tagsArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'savedCodes'), snippetData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaveModalOpen(false);
      }, 1500);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'savedCodes');
    } finally {
      setSavingSnippet(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto flex flex-col h-[calc(100vh-6.5rem)]">
      {/* Control Toolbar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0f1422] border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Interactive Playground</h1>
              <p className="text-[10px] text-slate-400">Monaco Engine & Sandboxed Environment</p>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs font-medium cursor-pointer"
            >
              <option value="javascript" className="bg-[#0f1422]">JavaScript (Node.js)</option>
              <option value="python" className="bg-[#0f1422]">Python 3</option>
              <option value="c" className="bg-[#0f1422]">C (GCC)</option>
              <option value="cpp" className="bg-[#0f1422]">C++ (G++)</option>
              <option value="java" className="bg-[#0f1422]">Java (OpenJDK)</option>
              <option value="html" className="bg-[#0f1422]">HTML / CSS Live</option>
              <option value="sql" className="bg-[#0f1422]">SQL</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => presets[language] && setCode(presets[language])}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1 px-2.5"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1 px-2.5"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1 px-2.5"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="p-1.5 rounded-lg border border-purple-500/40 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300 transition text-xs flex items-center gap-1 px-2.5"
            title="Save snippet to account"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save Code</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/25 transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split Panes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Monaco Editor Pane */}
        <div className="rounded-2xl bg-[#0b0e17] border border-slate-800 overflow-hidden shadow-xl flex flex-col h-full min-h-[350px]">
          <div className="px-4 py-2 bg-[#101422] border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Editor &bull; {language.toUpperCase()}</span>
            <span className="text-[11px] text-slate-500">Auto-saved locally</span>
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
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>
        </div>

        {/* Output & Console Drawer */}
        <div className="rounded-2xl bg-[#0d121f] border border-slate-800 overflow-hidden shadow-xl flex flex-col h-full min-h-[350px]">
          {/* Tabs: Console vs Live HTML Preview */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#101422] border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'console'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Output</span>
              </button>

              {language === 'html' && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                    activeTab === 'preview'
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Browser Preview</span>
                </button>
              )}
            </div>

            {executionTime !== null && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{executionTime}ms</span>
              </div>
            )}
          </div>

          {/* Console Output Area */}
          {activeTab === 'console' ? (
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-[#0a0d14] text-slate-200 space-y-3">
              {isRunning && (
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>Executing code securely in sandboxed context...</span>
                </div>
              )}

              {errors && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 whitespace-pre-wrap">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Runtime / Compiler Error:</span>
                  </div>
                  {errors}
                </div>
              )}

              {output ? (
                <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono">
                  {output}
                </pre>
              ) : (
                !isRunning && (
                  <p className="text-slate-600 italic">
                    Press "Run Code" to execute. Output will appear here.
                  </p>
                )
              )}
            </div>
          ) : (
            /* Live HTML / CSS Preview Iframe */
            <div className="flex-1 bg-white">
              <iframe
                title="Live HTML Preview"
                srcDoc={code}
                sandbox="allow-scripts"
                className="w-full h-full border-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Snippet Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#111728] border border-slate-700 rounded-2xl p-6 shadow-2xl relative text-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Save className="w-4 h-4 text-purple-400" />
                <span>Save Code Snippet</span>
              </h3>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-700 text-emerald-300 text-center text-sm font-medium">
                Snippet saved successfully to your Library!
              </div>
            ) : (
              <form onSubmit={handleSaveToLibrary} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Snippet Title</label>
                  <input
                    type="text"
                    required
                    value={snippetTitle}
                    onChange={(e) => setSnippetTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={snippetDescription}
                    onChange={(e) => setSnippetDescription(e.target.value)}
                    placeholder="Short summary of what this code does..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={snippetTags}
                    onChange={(e) => setSnippetTags(e.target.value)}
                    placeholder="algorithms, loops, quicksort"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSnippet}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs transition disabled:opacity-50"
                  >
                    {savingSnippet ? 'Saving...' : 'Save Snippet'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
