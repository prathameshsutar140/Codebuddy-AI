import React from 'react';
import {
  LayoutDashboard,
  Bot,
  FileCode2,
  Bug,
  GraduationCap,
  PlaySquare,
  Trophy,
  BrainCircuit,
  BarChart3,
  BookmarkCheck,
  Sparkles,
  Settings,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  mobileOpen,
  onCloseMobile
}) => {
  const { isAdmin, profile } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Code Assistant', icon: Bot, badge: 'Gemini' },
    { id: 'explain', label: 'Code Explainer', icon: FileCode2 },
    { id: 'debug', label: 'Debugging Lab', icon: Bug },
    { id: 'courses', label: 'Learn Programming', icon: GraduationCap },
    { id: 'playground', label: 'Coding Playground', icon: PlaySquare, badge: 'Monaco' },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'quiz', label: 'AI Quizzes', icon: BrainCircuit },
    { id: 'tutor', label: '1-on-1 AI Tutor', icon: Sparkles },
    { id: 'progress', label: 'My Progress', icon: BarChart3 },
    { id: 'saved', label: 'Saved Codes', icon: BookmarkCheck },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0d14] border-r border-slate-800/80 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 lg:hidden">
          <span className="font-bold text-white text-base tracking-tight">Navigation</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand header on desktop */}
        <div className="hidden lg:flex items-center gap-2.5 h-16 px-5 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-200 tracking-wide uppercase text-[11px]">
            Platform Menu
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Learning & Tools
          </p>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition duration-150 ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-purple-500/30 text-purple-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin section if applicable */}
          {isAdmin && (
            <div className="pt-4 mt-2 border-t border-slate-800/80">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-500/90 mb-2">
                Administration
              </p>
              <button
                onClick={() => handleItemClick('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  activeView === 'admin'
                    ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Admin Console</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Settings & User card */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => handleItemClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeView === 'settings'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <div className="px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-300 truncate">
                {profile?.preferredLanguage || 'JavaScript'} Track
              </p>
              <p className="text-[10px] text-purple-400 capitalize">
                {profile?.experienceLevel || 'Beginner'} Level
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
          </div>
        </div>
      </aside>
    </>
  );
};
