import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Trophy,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export const ProgressView: React.FC = () => {
  const { user, profile } = useAuth();
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyData = [
    { day: 'Mon', hours: 1.5, problems: 3 },
    { day: 'Tue', hours: 2.2, problems: 4 },
    { day: 'Wed', hours: 0.8, problems: 1 },
    { day: 'Thu', hours: 2.5, problems: 5 },
    { day: 'Fri', hours: 1.8, problems: 3 },
    { day: 'Sat', hours: 3.2, problems: 6 },
    { day: 'Sun', hours: 2.0, problems: 4 },
  ];

  const monthlyData = [
    { day: 'Week 1', hours: 8.5, problems: 14 },
    { day: 'Week 2', hours: 10.2, problems: 18 },
    { day: 'Week 3', hours: 7.4, problems: 12 },
    { day: 'Week 4', hours: 11.8, problems: 21 },
  ];

  const languageDistribution = [
    { name: 'JavaScript', value: 40, color: '#f59e0b' },
    { name: 'Python', value: 25, color: '#38bdf8' },
    { name: 'C / C++', value: 20, color: '#a855f7' },
    { name: 'SQL', value: 15, color: '#10b981' },
  ];

  const badges = [
    { title: 'Algorithm Apprentice', desc: 'Solved 10+ data structure challenges', unlocked: true, icon: Trophy, color: 'text-amber-400' },
    { title: 'Consistent Coder', desc: 'Maintained a 3-day active streak', unlocked: true, icon: Flame, color: 'text-rose-400' },
    { title: 'Quiz Master', desc: 'Scored 90%+ in 3 AI quizzes', unlocked: true, icon: Award, color: 'text-purple-400' },
    { title: 'Polyglot Developer', desc: 'Wrote code in 4 different languages', unlocked: false, icon: Layers, color: 'text-slate-500' },
  ];

  const activeChartData = filterPeriod === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Learning Progress & Analytics</h1>
            <p className="text-xs text-slate-400">
              Verified performance metrics, coding activity, and skill mastery
            </p>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-700/80 rounded-xl text-xs">
          <button
            onClick={() => setFilterPeriod('weekly')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterPeriod === 'weekly'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setFilterPeriod('monthly')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterPeriod === 'monthly'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Learning Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">
            {profile?.totalHoursLearned ? `${profile.totalHoursLearned}h` : '14.2h'}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">+2.5h this week</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">26</p>
          <span className="text-[11px] text-slate-400">84% first-attempt pass rate</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Quiz Accuracy</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">89%</p>
          <span className="text-[11px] text-purple-400">Top 15% across peers</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">
            {profile?.streakDays || 3} Days
          </p>
          <span className="text-[11px] text-rose-300">Keep it going tomorrow!</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coding Activity Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Coding Activity & Hours</h2>
              <p className="text-xs text-slate-400">Hours spent in code editor and learning modules</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Hours Learned" />
                <Bar dataKey="problems" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Problems Solved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Distribution (1 Col) */}
        <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Language Time Distribution</h2>
            <p className="text-xs text-slate-400">Breakdown of active practice by syntax</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {languageDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}</span>
                <span className="text-slate-500 text-[10px] ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white">Skill Milestones & Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-start gap-3 transition ${
                  b.unlocked
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-900/30 border-slate-800/40 opacity-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    b.unlocked ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${b.color}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{b.desc}</p>
                  <span className="text-[10px] font-semibold text-purple-400 mt-1 block">
                    {b.unlocked ? '✓ Unlocked' : 'In Progress'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
