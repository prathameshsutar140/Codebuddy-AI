import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Code2,
  Bot,
  FileCode,
  Bug,
  BrainCircuit,
  Trophy,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/coursesData';
import { CHALLENGES } from '../data/challengesData';

interface DashboardViewProps {
  onNavigate: (view: string, extra?: unknown) => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, profile } = useAuth();

  const dailyChallenge = CHALLENGES[0]; // Two Sum

  const languageProgress = [
    { language: 'JavaScript', progress: 68, color: 'from-amber-500 to-yellow-400' },
    { language: 'Python', progress: 45, color: 'from-blue-500 to-cyan-400' },
    { language: 'C Programming', progress: 30, color: 'from-purple-500 to-indigo-400' },
    { language: 'SQL', progress: 55, color: 'from-emerald-500 to-teal-400' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#121829] via-[#1a1c36] to-[#0f172a] border border-slate-700/60 p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Learning Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile?.name || user?.email?.split('@')[0] || 'Developer'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Target Goal:{' '}
              <span className="text-purple-300 font-medium">
                {profile?.learningGoals || 'Master programming and algorithm problem solving with CodeBuddy AI.'}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Ask CodeBuddy AI</span>
            </button>
            <button
              onClick={() => onNavigate('challenges')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Solve Challenges</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Current Streak</p>
            <p className="text-lg font-bold text-white">{profile?.streakDays || 1} Days</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Problems Solved</p>
            <p className="text-lg font-bold text-white">14</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Lessons Finished</p>
            <p className="text-lg font-bold text-white">8</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Quiz Accuracy</p>
            <p className="text-lg font-bold text-white">88%</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center gap-3.5 col-span-2 lg:col-span-1">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Learning Time</p>
            <p className="text-lg font-bold text-white">{profile?.totalHoursLearned || 4.5} hrs</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Path & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Learning & Quick Tool Launchers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Tools Launch Grid */}
          <div className="rounded-2xl bg-[#0d121f] border border-slate-800/80 p-5">
            <h2 className="text-sm font-bold text-white mb-3">AI Developer Tool Suite</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigate('assistant')}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 group-hover:scale-110 transition mb-2">
                  <Bot className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">AI Assistant</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Chat & code help</p>
              </button>

              <button
                onClick={() => onNavigate('explain')}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-blue-950/30 border border-slate-800 hover:border-blue-500/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 group-hover:scale-110 transition mb-2">
                  <FileCode className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-300">Code Explainer</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Line-by-line review</p>
              </button>

              <button
                onClick={() => onNavigate('debug')}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400 group-hover:scale-110 transition mb-2">
                  <Bug className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-rose-300">Debugging Lab</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Fix syntax & bugs</p>
              </button>

              <button
                onClick={() => onNavigate('playground')}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 text-left transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition mb-2">
                  <Code2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">Playground</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Monaco live runner</p>
              </button>
            </div>
          </div>

          {/* Continue Learning Course Cards */}
          <div className="rounded-2xl bg-[#0d121f] border border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Continue Learning</h2>
                <p className="text-xs text-slate-400">Structured lessons with interactive code sandboxes</p>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition"
              >
                <span>View All 7 Courses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {COURSES.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  onClick={() => onNavigate('courses', { courseId: course.id })}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase tracking-wider">
                        {course.language}
                      </span>
                      <span className="text-[10px] text-slate-400">{course.estimatedHours}h estimated</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-purple-400 font-medium">
                    <span>{course.lessons.length} Lessons</span>
                    <span className="group-hover:translate-x-1 transition flex items-center gap-1">
                      Resume <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Daily Challenge & Language Distribution */}
        <div className="space-y-6">
          {/* Daily Challenge Card */}
          <div className="rounded-2xl bg-gradient-to-b from-[#161c2e] to-[#0d121f] border border-purple-500/30 p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-purple-500/30">
                <Trophy className="w-3 h-3 text-amber-400" /> Daily Challenge
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {dailyChallenge.difficulty}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">{dailyChallenge.title}</h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
              {dailyChallenge.description}
            </p>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="text-slate-500">Sample: </span>
              {dailyChallenge.sampleInput}
            </div>

            <button
              onClick={() => onNavigate('challenges', { challengeId: dailyChallenge.id })}
              className="mt-4 w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition"
            >
              <span>Solve in Code Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Language Progress Breakdown */}
          <div className="rounded-2xl bg-[#0d121f] border border-slate-800/80 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Language Mastery</h3>
            <div className="space-y-3.5">
              {languageProgress.map((item) => (
                <div key={item.language}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-300">{item.language}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('quiz')}
              className="mt-5 w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              <span>Test Skills with AI Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
