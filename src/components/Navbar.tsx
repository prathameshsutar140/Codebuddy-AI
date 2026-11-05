import React, { useState } from 'react';
import {
  Bell,
  Search,
  Code2,
  Menu,
  X,
  Flame,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenAuth,
  onNavigate,
  activeView
}) => {
  const { user, profile, logout, isAdmin } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Daily Coding Challenge Ready', desc: 'Two Sum and Valid Palindrome are waiting for you!', time: '10m ago' },
    { id: 2, title: 'Streak Protected 🔥', desc: 'Your 3-day learning streak is active. Keep going!', time: '2h ago' },
    { id: 3, title: 'New Course Chapter', desc: 'C++ Virtual Polymorphism lesson updated.', time: '1d ago' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('c++') || q.includes('python') || q.includes('course') || q.includes('learn')) {
      onNavigate('courses');
    } else if (q.includes('debug') || q.includes('error')) {
      onNavigate('debug');
    } else if (q.includes('explain')) {
      onNavigate('explain');
    } else if (q.includes('challenge') || q.includes('problem')) {
      onNavigate('challenges');
    } else if (q.includes('quiz')) {
      onNavigate('quiz');
    } else if (q.includes('play') || q.includes('run')) {
      onNavigate('playground');
    } else {
      onNavigate('assistant');
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Brand logo & mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition duration-200">
            <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-purple-300 transition">
                CodeBuddy
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Learn Smarter. Code Better.
            </p>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-sm w-full mx-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses, challenges, or ask AI (Press Enter)..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition"
        />
      </form>

      {/* Right controls: Streak, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Streak chip */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{profile?.streakDays || 1}d Streak</span>
        </div>

        {/* Notifications button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111728] border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-200">
                <span>Notifications</span>
                <span className="text-[10px] text-purple-400 font-normal">3 new</span>
              </div>
              <div className="mt-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition cursor-pointer">
                    <p className="text-xs font-medium text-slate-200">{n.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Auth Profile or Login button */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  profile?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:block max-w-[100px] truncate">
                {profile?.name || user.email?.split('@')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#111728] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white truncate">{profile?.name || 'Developer'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 capitalize font-medium">
                      {profile?.experienceLevel || 'Beginner'}
                    </span>
                    {isAdmin && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate('progress');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
                  >
                    My Learning Progress
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('saved');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
                  >
                    Saved Code Snippets
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
                  >
                    Account Settings
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-950/40 rounded-lg transition font-medium"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
