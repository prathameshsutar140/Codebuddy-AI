import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock,
  Code2,
  ChevronRight,
  ArrowLeft,
  Play,
  Award,
  Sparkles
} from 'lucide-react';
import { COURSES } from '../data/coursesData';
import { Course, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { CodeBlock } from '../components/CodeBlock';
import Editor from '@monaco-editor/react';

interface CoursesViewProps {
  initialCourseId?: string;
  onOpenPlaygroundWithCode?: (code: string, language: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  initialCourseId,
  onOpenPlaygroundWithCode
}) => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    COURSES.find((c) => c.id === initialCourseId) || null
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    selectedCourse ? selectedCourse.lessons[0] : null
  );

  // Local state for completed lessons tracking
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(['c-intro', 'js-async'])
  );

  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'exercise'>('content');
  const [exerciseCode, setExerciseCode] = useState('');

  const toggleCompleteLesson = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(course.lessons[0] || null);
    setExerciseCode(course.lessons[0]?.starterCode || course.lessons[0]?.codeSnippet || '');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Course Detail View */}
      {selectedCourse && selectedLesson ? (
        <div className="space-y-4">
          {/* Top Breadcrumb & Return */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Courses</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{selectedCourse.title}</span>
              <span className="text-xs text-slate-600">&bull;</span>
              <span className="text-xs text-purple-300 font-semibold">{selectedLesson.title}</span>
            </div>
          </div>

          {/* Lesson Layout: Left Sidebar + Right Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Lessons Directory */}
            <div className="lg:col-span-1 space-y-3">
              <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Course Modules
                </h3>
                <div className="space-y-1.5">
                  {selectedCourse.lessons.map((lesson, idx) => {
                    const isCompleted = completedLessonIds.has(lesson.id);
                    const isCurrent = selectedLesson.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setExerciseCode(lesson.starterCode || lesson.codeSnippet || '');
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                          isCurrent
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {idx + 1}.
                          </span>
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Lesson Reader */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      {selectedCourse.language} Track
                    </span>
                    <h1 className="text-xl font-extrabold text-white mt-0.5">
                      {selectedLesson.title}
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">{selectedLesson.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompleteLesson(selectedLesson.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                        completedLessonIds.has(selectedLesson.id)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {completedLessonIds.has(selectedLesson.id) ? 'Completed' : 'Mark as Done'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Lesson Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      activeTab === 'content'
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lesson Guide
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      activeTab === 'code'
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Interactive Example
                  </button>
                </div>

                {/* Content Pane */}
                {activeTab === 'content' && (
                  <div className="space-y-5">
                    <MarkdownRenderer content={selectedLesson.content} />

                    {selectedLesson.keyPoints && selectedLesson.keyPoints.length > 0 && (
                      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                          Key Concept Takeaways
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5">
                          {selectedLesson.keyPoints.map((kp, idx) => (
                            <li key={idx}>{kp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Reference Code
                      </h4>
                      <CodeBlock
                        code={selectedLesson.codeSnippet}
                        language={selectedCourse.language.toLowerCase()}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 flex items-center justify-between">
                      <span>Live Monaco Code Runner</span>
                      <span className="text-purple-400 font-mono text-[11px]">
                        {selectedCourse.language}
                      </span>
                    </div>
                    <div className="h-80 border border-slate-800 rounded-xl overflow-hidden">
                      <Editor
                        height="100%"
                        language={selectedCourse.language.toLowerCase() === 'c' || selectedCourse.language.toLowerCase() === 'c++' ? 'cpp' : selectedCourse.language.toLowerCase()}
                        theme="vs-dark"
                        value={exerciseCode}
                        onChange={(v) => setExerciseCode(v || '')}
                        options={{ minimap: { enabled: false }, fontSize: 13 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Course Catalog Grid */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121829] to-[#0f172a] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-1 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Curated Curriculum</span>
              </div>
              <h1 className="text-xl font-bold text-white">Programming Learning Center</h1>
              <p className="text-xs text-slate-400 max-w-xl mt-1">
                Step-by-step interactive courses covering foundational computer science, systems programming, and modern full-stack web architectures.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map((course) => {
              const completedCount = course.lessons.filter((l) =>
                completedLessonIds.has(l.id)
              ).length;
              const percent = Math.round((completedCount / course.lessons.length) * 100);

              return (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 hover:border-purple-500/50 transition cursor-pointer group flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 uppercase tracking-wider">
                        {course.language}
                      </span>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.estimatedHours} hrs</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span>{course.lessons.length} Modules</span>
                      <span className="font-mono text-purple-400">{percent}% Completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
