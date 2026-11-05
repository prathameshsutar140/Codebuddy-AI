export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  experienceLevel: ExperienceLevel;
  preferredLanguage: string;
  learningGoals: string;
  role: 'student' | 'admin';
  createdAt: string;
  streakDays?: number;
  totalHoursLearned?: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  content: string;
  codeSnippet: string;
  keyPoints: string[];
  exercisePrompt?: string;
  starterCode?: string;
  solutionCode?: string;
}

export interface Course {
  id: string;
  title: string;
  language: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  lessons: Lesson[];
}

export interface UserProgressRecord {
  progressId: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  completionPercentage: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  explanationLevel?: ExperienceLevel;
}

export interface SavedCodeSnippet {
  id: string;
  userId: string;
  title: string;
  language: string;
  sourceCode: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string | null;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  topic: string;
  difficulty: ExperienceLevel;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  callWrapper?: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  hints: string[];
  testCases: TestCase[];
}

export interface ChallengeSubmission {
  id: string;
  userId: string;
  challengeId: string;
  sourceCode: string;
  language: string;
  status: 'passed' | 'failed' | 'error';
  executionTimeMs: number;
  testsPassed: number;
  totalTests: number;
  submittedAt: string;
}

export interface CodeExplanation {
  overview: string;
  lineByLine: Array<{ lines: string; explanation: string }>;
  variables: Array<{ name: string; type: string; purpose: string }>;
  functions: Array<{ name: string; parameters: string; returns: string; description: string }>;
  logicSteps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  sampleInputOutput: {
    sampleInput: string;
    sampleOutput: string;
  };
  improvementTips: string[];
}

export interface DebugResult {
  errorSummary: string;
  likelyCause: string;
  suggestedFix: string;
  correctedCode: string;
  changesMade: string[];
  preventionTip: string;
}
