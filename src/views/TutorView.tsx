import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  User,
  GraduationCap,
  Calendar,
  Lightbulb,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

interface TutorMessage {
  id: string;
  role: 'tutor' | 'user';
  content: string;
  timestamp: string;
}

export const TutorView: React.FC = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'initial',
      role: 'tutor',
      content: `Hello! I'm your **Personal AI Tutor**.

My mission is to help you truly master computer science concepts without feeling overwhelmed. Rather than just giving you raw code answers, I guide you step-by-step with intuitive analogies, practice challenges, and structured study plans.

What would you like help with today?
- *Understanding a tough concept like recursion or pointers?*
- *Building a 4-week personalized study plan?*
- *Getting custom practice drills for an upcoming exam or interview?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [simpleEnglish, setSimpleEnglish] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const text = customText || inputQuery;
    if (!text.trim() || loading) return;

    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          userContext: {
            experienceLevel: profile?.experienceLevel || 'beginner',
            preferredLanguage: profile?.preferredLanguage || 'JavaScript',
            learningGoals: profile?.learningGoals || 'Learn full-stack web development'
          },
          simpleEnglish
        })
      });

      const data = await res.json();
      const tutorMsg: TutorMessage = {
        id: `t-${Date.now()}`,
        role: 'tutor',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: unknown) {
      console.error('Tutor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const studyPlanPill = 'Create a 4-week step-by-step study plan for learning full-stack web development with JavaScript and Node.js.';
  const recursionPill = 'Explain recursion like I am 10 years old with Russian dolls or a mirror analogy.';
  const memoryPill = 'What is the difference between Stack and Heap memory, and why do pointers matter?';

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-4xl mx-auto rounded-2xl bg-[#0b0e17] border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#0f1422] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Personal 1-on-1 AI Tutor</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Socratic Mode
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Guidance tailored to your experience ({profile?.experienceLevel || 'Beginner'})
            </p>
          </div>
        </div>

        {/* Simple English Mode Toggle */}
        <button
          onClick={() => setSimpleEnglish(!simpleEnglish)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
            simpleEnglish
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
          title="Toggles analogies and beginner-friendly language"
        >
          {simpleEnglish ? (
            <ToggleRight className="w-4 h-4 text-purple-400" />
          ) : (
            <ToggleLeft className="w-4 h-4 text-slate-400" />
          )}
          <span>Simple English (Analogies)</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m) => {
          const isTutor = m.role === 'tutor';
          return (
            <div
              key={m.id}
              className={`flex gap-3 sm:gap-4 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isTutor
                    ? 'bg-[#121726] border border-slate-800 text-slate-200'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {isTutor ? (
                  <MarkdownRenderer content={m.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
                <span className="block mt-2 text-[10px] text-slate-500 text-right">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 py-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Tutor is formulating a tailored pedagogical response...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-[#0c101d] border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleSend(studyPlanPill)}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs"
          >
            🗓️ 4-Week Study Plan
          </button>
          <button
            onClick={() => handleSend(recursionPill)}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs"
          >
            🪆 Explain Recursion Simply
          </button>
          <button
            onClick={() => handleSend(memoryPill)}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs"
          >
            🧠 Stack vs Heap Memory
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 bg-[#0f1422] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask your tutor anything (e.g. 'How do closures work?', 'Give me a quiz on loops')..."
            className="w-full pl-4 pr-12 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="absolute right-2 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
