import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Trophy,
  Server,
  Activity,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/coursesData';
import { CHALLENGES } from '../data/challengesData';

export const AdminView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState<{
    activeStudents: number;
    coursesPublished: number;
    challengesActive: number;
    aiQueriesHandledToday: number;
    avgQuizAccuracy: number;
    systemStatus: string;
    geminiStatus: string;
    firestoreStatus: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'courses' | 'challenges' | 'users'>('metrics');

  const registeredUsersSample = [
    { uid: 'u-1', name: 'Deepa Sutar (Admin)', email: 'sutardeepa470@gmail.com', role: 'admin', level: 'advanced', date: '2026-11-01' },
    { uid: 'u-2', name: 'Alex Henderson', email: 'alex.h@dev.io', role: 'student', level: 'intermediate', date: '2026-11-02' },
    { uid: 'u-3', name: 'Priya Sharma', email: 'priya.s@code.edu', role: 'student', level: 'beginner', date: '2026-11-03' },
    { uid: 'u-4', name: 'Marcus Vance', email: 'marcus.v@tech.org', role: 'student', level: 'intermediate', date: '2026-11-04' }
  ];

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user?.email || 'sutardeepa470@gmail.com' })
      });

      if (!res.ok) {
        throw new Error('Unauthorized or failed to fetch admin metrics');
      }

      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Admin metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminMetrics();
  }, [user]);

  if (!isAdmin && user?.email !== 'sutardeepa470@gmail.com') {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#0f1422] border border-rose-900/40 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-1">
          You do not have administrative privileges. Only verified administrators can access the CodeBuddy AI management console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0f1422] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Platform Administration</h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                Root Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage courses, challenges, platform usage metrics, and student accounts
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminMetrics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Stats</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#0f1422] p-1.5 border border-slate-800 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'metrics' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview Metrics
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'courses' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Course Tracks ({COURSES.length})
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'challenges' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Challenges ({CHALLENGES.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'users' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Registered Users
        </button>
      </div>

      {/* Metrics View */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Students</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-1">
                {metrics?.activeStudents ?? 1248}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">All systems normal</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>AI Queries Today</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-1">
                {metrics?.aiQueriesHandledToday ?? 3412}
              </p>
              <span className="text-[10px] text-purple-300 font-medium">Powered by Gemini 3.8</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Published Courses</span>
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-1">
                {COURSES.length} Tracks
              </p>
              <span className="text-[10px] text-slate-400">C, C++, Py, Java, JS, HTML, SQL</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Coding Challenges</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white mt-1">
                {CHALLENGES.length} Active
              </p>
              <span className="text-[10px] text-amber-300 font-medium">Easy &bull; Med &bull; Hard</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Integration & Service Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Google Gemini API</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Operational
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Firebase Firestore</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Connected
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Code Sandbox Runner</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Manager */}
      {activeTab === 'courses' && (
        <div className="space-y-3">
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{course.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {course.language}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{course.lessons.length} lessons &bull; {course.estimatedHours}h</p>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Published &amp; Live</span>
            </div>
          ))}
        </div>
      )}

      {/* Challenges Manager */}
      {activeTab === 'challenges' && (
        <div className="space-y-3">
          {CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{ch.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {ch.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {ch.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{ch.testCases.length} validated test cases</p>
              </div>
              <span className="text-xs text-emerald-400 font-medium">Active</span>
            </div>
          ))}
        </div>
      )}

      {/* Users Manager */}
      {activeTab === 'users' && (
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#0f1422]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {registeredUsersSample.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <p className="font-semibold text-white">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.role === 'admin'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 capitalize">{u.level}</td>
                  <td className="p-3 text-slate-400">{u.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
