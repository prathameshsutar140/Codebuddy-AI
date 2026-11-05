import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  RefreshCw,
  Code2,
  CornerDownLeft,
  Sliders,
  ChevronDown,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ChatMessage, ExperienceLevel } from '../types';

export const AIAssistantView: React.FC = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **CodeBuddy AI**, your dedicated programming companion.

I can help you:
- **Write and debug code** in C, C++, Python, JavaScript, Java, SQL, and HTML/CSS
- **Explain algorithms** step-by-step with complexity analysis
- **Refactor code** for performance, readability, and clean architecture
- **Convert algorithms** from pseudocode or mathematical definitions into working implementations

What coding topic or problem would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState<ExperienceLevel>(profile?.experienceLevel || 'intermediate');
  const [languageFocus, setLanguageFocus] = useState<string>(profile?.preferredLanguage || 'JavaScript');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { label: 'Explain loops in C', text: 'Explain how for, while, and do-while loops work in C with code examples.' },
    { label: 'Factorial in Python', text: 'Write a recursive and an iterative factorial function in Python, and compare their time and space complexity.' },
    { label: 'How does async/await work?', text: 'Explain JavaScript Promises and async/await using an analogy and practical code.' },
    { label: 'Object-Oriented Programming', text: 'Explain the 4 pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism) with real-world examples.' },
    { label: 'Explain Binary Search', text: 'How does Binary Search work? Show implementation and explain why its complexity is O(log n).' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputPrompt('');
    setLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: historyPayload,
          explanationLevel,
          language: languageFocus
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        explanationLevel
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error('AI chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Error**: ${err instanceof Error ? err.message : 'Failed to reach AI service. Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (messages.length < 2 || loading) return;
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;
    const actualIndex = messages.length - 1 - lastUserIndex;
    const lastUserPrompt = messages[actualIndex].content;
    // Remove last assistant message
    setMessages((prev) => prev.slice(0, actualIndex + 1));
    handleSendMessage(lastUserPrompt);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-new',
        role: 'assistant',
        content: `Chat cleared! How can I assist with your code or programming study right now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto rounded-2xl bg-[#0b0e17] border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Header with Explanation Level & Language Selectors */}
      <div className="px-4 py-3 bg-[#0f1422] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>CodeBuddy Assistant</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-normal">
                Gemini 3.8
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Contextual pedagogical programming companion</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={languageFocus}
              onChange={(e) => setLanguageFocus(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
            >
              <option value="JavaScript" className="bg-[#0f1422]">JavaScript</option>
              <option value="Python" className="bg-[#0f1422]">Python</option>
              <option value="C" className="bg-[#0f1422]">C</option>
              <option value="C++" className="bg-[#0f1422]">C++</option>
              <option value="Java" className="bg-[#0f1422]">Java</option>
              <option value="HTML & CSS" className="bg-[#0f1422]">HTML/CSS</option>
              <option value="SQL" className="bg-[#0f1422]">SQL</option>
            </select>
          </div>

          {/* Explanation Level Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={explanationLevel}
              onChange={(e) => setExplanationLevel(e.target.value as ExperienceLevel)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
            >
              <option value="beginner" className="bg-[#0f1422]">Beginner Level</option>
              <option value="intermediate" className="bg-[#0f1422]">Intermediate Level</option>
              <option value="advanced" className="bg-[#0f1422]">Advanced Level</option>
            </select>
          </div>

          {/* Actions: Clear & Regenerate */}
          <button
            onClick={handleRegenerate}
            disabled={messages.length < 2 || loading}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition disabled:opacity-40"
            title="Regenerate last response"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-br-none ml-10'
                    : 'bg-[#121726] border border-slate-800/90 text-slate-200 rounded-bl-none'
                }`}
              >
                {!isUser ? (
                  <MarkdownRenderer content={msg.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}

                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-purple-200' : 'text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.explanationLevel && !isUser && (
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800/80 text-purple-300">
                      {msg.explanationLevel}
                    </span>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 font-semibold text-xs">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs py-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#121726] border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-slate-400 font-mono text-xs">Generating verified explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Shelf */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-[#0c101d] border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] uppercase font-semibold text-slate-500 shrink-0">Try asking:</span>
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p.text)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-slate-300 text-xs transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Composer */}
      <div className="p-3 sm:p-4 bg-[#0f1422] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Ask any question about ${languageFocus}, debug an error, or explain an algorithm...`}
            rows={2}
            className="w-full resize-none pl-4 pr-24 py-2.5 bg-slate-900/95 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-normal"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition disabled:opacity-40 shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="mt-1.5 text-[10px] text-slate-500 text-center">
          CodeBuddy AI provides educational insights. Always verify code in your development environment.
        </p>
      </div>
    </div>
  );
};
