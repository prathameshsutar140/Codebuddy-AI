import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './views/DashboardView';
import { AIAssistantView } from './views/AIAssistantView';
import { CodeExplainerView } from './views/CodeExplainerView';
import { DebuggingLabView } from './views/DebuggingLabView';
import { PlaygroundView } from './views/PlaygroundView';
import { CoursesView } from './views/CoursesView';
import { QuizView } from './views/QuizView';
import { ChallengesView } from './views/ChallengesView';
import { TutorView } from './views/TutorView';
import { SavedCodesView } from './views/SavedCodesView';
import { ProgressView } from './views/ProgressView';
import { AdminView } from './views/AdminView';
import { SettingsView } from './views/SettingsView';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Navigation navigation params
  const [navParams, setNavParams] = useState<{ courseId?: string; challengeId?: string }>({});

  const handleNavigate = (view: string, extra?: unknown) => {
    setActiveView(view);
    if (extra && typeof extra === 'object') {
      setNavParams(extra as { courseId?: string; challengeId?: string });
    } else {
      setNavParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenAuth={() => handleOpenAuth('login')}
        onNavigate={handleNavigate}
        activeView={activeView}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0 transition-all">
          {activeView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth('signup')}
            />
          )}

          {activeView === 'assistant' && <AIAssistantView />}

          {activeView === 'explain' && <CodeExplainerView />}

          {activeView === 'debug' && <DebuggingLabView />}

          {activeView === 'playground' && <PlaygroundView />}

          {activeView === 'courses' && (
            <CoursesView initialCourseId={navParams.courseId} />
          )}

          {activeView === 'quiz' && <QuizView />}

          {activeView === 'challenges' && (
            <ChallengesView initialChallengeId={navParams.challengeId} />
          )}

          {activeView === 'tutor' && <TutorView />}

          {activeView === 'saved' && <SavedCodesView />}

          {activeView === 'progress' && <ProgressView />}

          {activeView === 'admin' && <AdminView />}

          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
