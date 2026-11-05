# CodeBuddy AI – Advanced AI-Powered Programming Learning Platform

> **Tagline:** Learn Smarter. Code Better. Build Your Future.

CodeBuddy AI is an intelligent full-stack programming education platform that assists students and developers in learning programming languages, understanding complex code, debugging errors, solving algorithmic challenges, practicing in an interactive Monaco editor, and evaluating their skills with AI-generated quizzes.

---

## 🌟 Core Features

### 1. 🤖 AI Code Assistant (Gemini 3.8 Flash)
- Interactive conversational chat with real-time markdown and syntax highlighting.
- Context-aware explanations tailored across **Beginner**, **Intermediate**, and **Advanced** levels.
- Code generation, algorithmic conversion, refactoring, and follow-up inquiry handling.
- Integrated one-click copy and source file download.

### 2. 🔍 Code Explainer
- In-depth algorithmic breakdown of code across **C, C++, Python, Java, JavaScript, HTML/CSS, and SQL**.
- Line-by-line inspection cards with associated line spans.
- Variable roles, function signatures, and step-by-step logic execution traces.
- Exact Big-O time and space complexity evaluations with rationales.
- Sample input and output runs.

### 3. 🧪 Debugging Lab
- Side-by-side **Original Source Code** and **Suggested Corrected Code** views without silent overwrites.
- Diagnoses runtime exceptions, syntax errors, and logic traps.
- Detailed cause analysis, changes made breakdown, and future prevention tips.
- "Apply Fix to Editor" instant action button.

### 4. 💻 Interactive Coding Playground (Monaco Editor)
- High-performance Monaco editor supporting syntax highlighting, line numbers, and formatting.
- Multi-language sandbox: JavaScript (Node.js isolated VM with timeout limits), Python, C, C++, Java, and SQL.
- Real-time HTML & CSS browser preview iframe.
- Standard output, runtime error traces, and millisecond execution timer.
- Snippet saving directly to the authenticated user's library.

### 5. 📚 Programming Learning Center (Curated Curriculum)
- **C Programming:** Compilers, Variables, Memory Sizes, Pointers, and Structures.
- **C++ Programming:** Classes, Encapsulation, RAII, Virtual Functions, and Polymorphism.
- **Python:** Data Structures, List Comprehensions, Generators, and OOP.
- **Java:** JVM Architecture, Type Safety, Object Structures, and Garbage Collection.
- **JavaScript:** Event Loop, Promises, Async/Await, and Functional Array Pipelines.
- **HTML & CSS:** Modern Flexbox and 2D CSS Grid Layouts.
- **SQL:** Relational Database Engineering, JOINs, Aggregations, and GROUP BY.

### 6. 🧠 AI Quiz Generator
- Dynamic quiz generation with 4 multiple-choice options, contextual code snippets, and timers.
- Immediate evaluation with in-depth pedagogical explanations.
- Automatic score tally and persistent tracking in Firebase Firestore.

### 7. 🏆 Practice Arena & Coding Challenges
- Categorized problem library: Arrays, Strings, Loops, Algorithms, and Data Structures across Easy, Medium, and Hard.
- Sandboxed test case evaluation with input/output matching.
- Hint reveals and progress tracking upon passing all test cases.

### 8. 🎓 Personal 1-on-1 AI Tutor
- Socratic learning mode encouraging exploration rather than mere answers.
- **"Simple English" Analogy Mode** designed for beginners (e.g. Russian dolls for recursion).
- Custom 4-week study plan generation.

### 9. 📁 Saved Code Library
- Personal snippet repository with multi-tagging and search.
- One-click copy, download, and instant playground opening.

### 10. 📊 Learning Analytics & Recharts
- Verified hours learned, problems solved, and quiz accuracy.
- Weekly/Monthly coding activity bar charts.
- Language distribution pie charts.
- Skill milestones and learning streak tracker.

### 11. 🛡️ Administrator Dashboard
- Server-side role-based access control (RBAC).
- Platform metrics: Active students, AI queries handled, published courses, and operational health.
- User management table and curriculum status.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Recharts, Monaco Editor (`@monaco-editor/react`), React Markdown, remark-gfm, canvas-confetti.
- **Backend:** Node.js, Express.js (`server.ts`), Vite middleware in development.
- **AI Engine:** Google Gemini API (`@google/genai`) with `gemini-3.8-flash`.
- **Database:** Firebase Firestore with hardened security rules.
- **Authentication:** Firebase Authentication (Email/Password, Google Sign-In, Password Reset).

---

## 🚀 Environment Variables

Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="your_google_gemini_api_key"
PORT=3000
NODE_ENV=development
```

---

## 🔒 Security & Sandboxing

1. **Firestore Security Rules:** Hardened rule specifications protecting user PII, restricting write operations to document owners, and securing administrative collections.
2. **Safe Code Execution:** User JavaScript code executes in an isolated Node.js VM context with a strict 2-second timeout and removed dangerous globals (`process`, `require`, `eval`, `Function`). Compiled languages are evaluated with deterministic static verification.
3. **Secret Protection:** Google Gemini API keys are maintained exclusively on the server side in `server.ts`. Client code never accesses raw API secrets.
