import React, { useState, useEffect } from 'react';
import {
  BookmarkCheck,
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Download,
  PlaySquare,
  Check,
  Tag,
  Clock,
  Code2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { SavedCodeSnippet } from '../types';

interface SavedCodesViewProps {
  onOpenPlaygroundWithCode?: (code: string, language: string) => void;
}

export const SavedCodesView: React.FC<SavedCodesViewProps> = ({ onOpenPlaygroundWithCode }) => {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<SavedCodeSnippet[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit / Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<SavedCodeSnippet | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [sourceCode, setSourceCode] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  // Sample default starter snippets for immediate usability
  const initialDefaultSnippets: SavedCodeSnippet[] = [
    {
      id: 'default-1',
      userId: user?.uid || 'guest',
      title: 'Fast Modular Exponentiation',
      language: 'python',
      description: 'Compute (base^exp) % mod in O(log exp) time complexity.',
      tags: ['math', 'algorithms', 'python'],
      sourceCode: `def mod_pow(base, exp, mod):
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp = exp >> 1
        base = (base * base) % mod
    return result

print(mod_pow(2, 10, 1000)) # Output: 24`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default-2',
      userId: user?.uid || 'guest',
      title: 'Debounce Utility Hook',
      language: 'javascript',
      description: 'Limits function execution frequency in high-rate events like search input typing.',
      tags: ['react', 'utilities', 'frontend'],
      sourceCode: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const fetchSnippets = async () => {
    if (!user) {
      setSnippets(initialDefaultSnippets);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'savedCodes'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const loaded: SavedCodeSnippet[] = [];
      snap.forEach((d) => {
        loaded.push({ id: d.id, ...d.data() } as SavedCodeSnippet);
      });

      if (loaded.length === 0) {
        setSnippets(initialDefaultSnippets);
      } else {
        setSnippets(loaded);
      }
    } catch (err) {
      console.warn('Failed to load user snippets from Firestore:', err);
      setSnippets(initialDefaultSnippets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [user]);

  const handleOpenModal = (snippet?: SavedCodeSnippet) => {
    if (snippet) {
      setEditingSnippet(snippet);
      setTitle(snippet.title);
      setDescription(snippet.description || '');
      setLanguage(snippet.language);
      setSourceCode(snippet.sourceCode);
      setTags(snippet.tags.join(', '));
    } else {
      setEditingSnippet(null);
      setTitle('');
      setDescription('');
      setLanguage('javascript');
      setSourceCode('// Paste or write snippet here');
      setTags('utility');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sourceCode.trim()) return;

    setSaving(true);
    const tagsArr = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10);

    try {
      if (editingSnippet) {
        if (user && !editingSnippet.id.startsWith('default-')) {
          const docRef = doc(db, 'savedCodes', editingSnippet.id);
          await updateDoc(docRef, {
            title,
            description,
            language,
            sourceCode,
            tags: tagsArr,
            updatedAt: new Date().toISOString()
          });
        }
        setSnippets((prev) =>
          prev.map((s) =>
            s.id === editingSnippet.id
              ? {
                  ...s,
                  title,
                  description,
                  language,
                  sourceCode,
                  tags: tagsArr,
                  updatedAt: new Date().toISOString()
                }
              : s
          )
        );
      } else {
        const newSnippet: SavedCodeSnippet = {
          id: `snip-${Date.now()}`,
          userId: user?.uid || 'guest',
          title,
          description,
          language,
          sourceCode,
          tags: tagsArr,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (user) {
          const docRef = await addDoc(collection(db, 'savedCodes'), {
            userId: user.uid,
            title,
            description,
            language,
            sourceCode,
            tags: tagsArr,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          newSnippet.id = docRef.id;
        }

        setSnippets((prev) => [newSnippet, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save snippet:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;
    try {
      if (user && !id.startsWith('default-')) {
        await deleteDoc(doc(db, 'savedCodes', id));
      }
      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete snippet:', err);
    }
  };

  const handleCopy = (snip: SavedCodeSnippet) => {
    navigator.clipboard.writeText(snip.sourceCode);
    setCopiedId(snip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (snip: SavedCodeSnippet) => {
    const extMap: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      c: 'c',
      cpp: 'cpp',
      java: 'java',
      html: 'html',
      sql: 'sql'
    };
    const ext = extMap[snip.language.toLowerCase()] || 'txt';
    const blob = new Blob([snip.sourceCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snip.title.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesLang =
      selectedLanguage === 'All' ||
      s.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Saved Code Library</h1>
            <p className="text-xs text-slate-400">
              Personal repository of your snippets, algorithms, and sandbox experiments
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Snippet</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, tag, or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="All">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="sql">SQL</option>
          </select>
        </div>
      </div>

      {/* Snippet Grid */}
      {filteredSnippets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0b0e17] border border-slate-800 text-slate-500">
          <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No Snippets Found</p>
          <p className="text-xs text-slate-500 mt-1">
            Create your first snippet or adjust your search filter above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSnippets.map((snip) => (
            <div
              key={snip.id}
              className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 flex flex-col justify-between shadow-lg group hover:border-purple-500/30 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase tracking-wider">
                    {snip.language}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-90">
                    <button
                      onClick={() => handleCopy(snip)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Copy code"
                    >
                      {copiedId === snip.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(snip)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Download snippet"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(snip)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit snippet"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(snip.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="Delete snippet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                  {snip.title}
                </h3>
                {snip.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{snip.description}</p>
                )}

                {/* Code Preview */}
                <pre className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-36">
                  <code>{snip.sourceCode}</code>
                </pre>
              </div>

              {/* Tags & Timestamp Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {snip.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800/70 text-slate-300 text-[10px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <span>{new Date(snip.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Snippet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#111728] border border-slate-700 rounded-2xl p-6 shadow-2xl relative text-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                {editingSnippet ? 'Edit Snippet' : 'New Code Snippet'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="html">HTML</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="react, hooks, math"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Source Code</label>
                <textarea
                  rows={8}
                  required
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Snippet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
