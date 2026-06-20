import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import InputForm from './components/InputForm';
import Results from './components/Results';
import BulkUpload from './components/BulkUpload';
import { AnalyzeResponse } from './types';
import { useAnalyze } from './hooks/useAnalyze';
import { PlatformInput } from './types';

type AnalysisMode = 'single' | 'bulk';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('codelens-darkmode');
    if (stored !== null) return JSON.parse(stored);
    return true;
  });

  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const [mode, setMode] = useState<AnalysisMode>('single');

  const mutation = useAnalyze();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('codelens-darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleAnalyze = (input: PlatformInput) => {
    mutation.mutate(input, {
      onSuccess: (data) => {
        setResults(data);
      },
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-[#1a1a1a] !text-neutral-900 dark:!text-neutral-100 !border !border-neutral-200 dark:!border-[#262626]',
          duration: 3000,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-[#0a0a0a]/80 border-b border-neutral-200 dark:border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">CodeLens AI</h1>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] hover:bg-neutral-200 dark:hover:bg-[#262626] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            ) : (
              <FiMoon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            )}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Toggle */}
        {!results && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center p-1 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] rounded-xl">
              <button
                onClick={() => setMode('single')}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === 'single'
                    ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Single Analysis
              </button>
              <button
                onClick={() => setMode('bulk')}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === 'bulk'
                    ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Bulk Analysis
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'single' ? (
            !results ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InputForm
                  onSubmit={handleAnalyze}
                  isLoading={mutation.isPending}
                />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Results data={results} onBack={() => setResults(null)} />
              </motion.div>
            )
          ) : (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BulkUpload />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-[#262626] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-neutral-500">
          <p>CodeLens AI - Analyze your competitive programming profiles with AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
