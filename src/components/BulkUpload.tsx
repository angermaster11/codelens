import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFile, FiDownload, FiChevronDown, FiChevronUp, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { bulkAnalyze } from '../services/api';
import { BulkResult } from '../types';

type UploadState = 'idle' | 'uploading' | 'complete' | 'error';

function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [results, setResults] = useState<BulkResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
      setUploadState('idle');
      setResults([]);
      setErrorMessage('');
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      setUploadState('idle');
      setResults([]);
      setErrorMessage('');
    }
  }, []);

  const isValidFile = (f: File): boolean => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = f.name.toLowerCase();
    return validExtensions.some((ext) => fileName.endsWith(ext));
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadState('uploading');
    setErrorMessage('');
    setResults([]);

    try {
      const data = await bulkAnalyze(file);
      setResults(data);
      setUploadState('complete');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred during bulk analysis.';
      setErrorMessage(message);
      setUploadState('error');
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadState('idle');
    setResults([]);
    setErrorMessage('');
    setExpandedRows(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleRowExpanded = (row: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(row)) {
        next.delete(row);
      } else {
        next.add(row);
      }
      return next;
    });
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-analysis-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'row', 'username', 'status', 'error', 'overall_score',
      'dsa_strength', 'competitive_programming_level', 'open_source_level',
      'interview_readiness', 'faang_readiness', 'platforms_analyzed',
    ];

    const csvRows = [headers.join(',')];

    for (const result of results) {
      const ai = result.ai_analysis;
      const platformNames = Object.keys(result.platforms).join(';');
      const row = [
        result.row,
        `"${result.username}"`,
        result.status,
        `"${result.error || ''}"`,
        ai?.overall_score ?? '',
        `"${ai?.dsa_strength ?? ''}"`,
        `"${ai?.competitive_programming_level ?? ''}"`,
        `"${ai?.open_source_level ?? ''}"`,
        `"${ai?.interview_readiness ?? ''}"`,
        `"${ai?.faang_readiness ?? ''}"`,
        `"${platformNames}"`,
      ];
      csvRows.push(row.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-analysis-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Bulk Analysis
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Upload a CSV or Excel file to analyze multiple coding profiles at once
        </p>
      </motion.div>

      {/* File Upload Area */}
      {uploadState === 'idle' && !file && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-white/5'
              : 'border-neutral-300 dark:border-[#333] hover:border-neutral-400 dark:hover:border-neutral-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload CSV or Excel file"
          />

          <FiUpload className="w-12 h-12 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" />
          <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
            {isDragOver ? 'Drop your file here' : 'Drag and drop your file here'}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Supported formats: .csv, .xlsx, .xls
          </p>
        </motion.div>
      )}

      {/* Selected File Info */}
      {file && uploadState === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FiFile className="w-5 h-5 text-neutral-700 dark:text-white" />
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {file.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <FiX className="w-4 h-4" />
            </button>
            <button
              onClick={handleUpload}
              className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-medium rounded-xl hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all"
            >
              Analyze All
            </button>
          </div>
        </motion.div>
      )}

      {/* Uploading State */}
      {uploadState === 'uploading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] rounded-2xl">
            <div className="w-5 h-5 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
              Analyzing profiles... This may take a moment.
            </span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {uploadState === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 dark:text-red-300 font-medium">
                Upload Failed
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errorMessage}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* Results */}
      {uploadState === 'complete' && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] rounded-xl">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold">{successCount}</span> successful
                </span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">{errorCount}</span> failed
                  </span>
                </div>
              )}
              <span className="text-sm text-neutral-500">
                {results.length} total
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadJSON}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-[#262626] hover:bg-neutral-300 dark:hover:bg-[#333] text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={downloadCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-[#262626] hover:bg-neutral-300 dark:hover:bg-[#333] text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 text-white dark:text-black text-sm font-medium rounded-lg transition-colors"
              >
                New Upload
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.row}
                className="border border-neutral-200 dark:border-[#262626] rounded-xl overflow-hidden bg-neutral-50 dark:bg-[#1a1a1a]"
              >
                <button
                  onClick={() => toggleRowExpanded(result.row)}
                  className="w-full flex items-center justify-between p-4 hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors text-left"
                  aria-expanded={expandedRows.has(result.row)}
                  aria-label={`Toggle details for row ${result.row}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 w-8">
                      #{result.row}
                    </span>
                    {result.status === 'success' ? (
                      <FiCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
                    ) : (
                      <FiAlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {result.username || 'Unknown'}
                    </span>
                    {result.status === 'success' && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {Object.keys(result.platforms).length} platform(s)
                      </span>
                    )}
                    {result.status === 'error' && (
                      <span className="text-xs text-red-500">
                        {result.error}
                      </span>
                    )}
                  </div>
                  {expandedRows.has(result.row) ? (
                    <FiChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedRows.has(result.row) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-neutral-200 dark:border-[#262626] pt-4">
                        {Object.keys(result.platforms).length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
                              Platforms
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {Object.entries(result.platforms).map(
                                ([platform, data]) => (
                                  <div
                                    key={platform}
                                    className="px-3 py-2 bg-neutral-100 dark:bg-[#262626] rounded-lg"
                                  >
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 capitalize">
                                      {platform}
                                    </p>
                                    <p className="text-sm text-neutral-900 dark:text-white truncate">
                                      {data.username}
                                    </p>
                                    <span
                                      className={`text-xs ${
                                        data.status === 'success'
                                          ? 'text-green-600 dark:text-green-500'
                                          : 'text-red-500'
                                      }`}
                                    >
                                      {data.status}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {result.ai_analysis && (
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
                              AI Analysis
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div className="p-3 bg-neutral-100 dark:bg-[#262626] rounded-lg">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Overall Score</p>
                                <p className="text-lg font-bold text-neutral-900 dark:text-white">{result.ai_analysis.overall_score}</p>
                              </div>
                              <div className="p-3 bg-neutral-100 dark:bg-[#262626] rounded-lg">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">DSA Strength</p>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{result.ai_analysis.dsa_strength}</p>
                              </div>
                              <div className="p-3 bg-neutral-100 dark:bg-[#262626] rounded-lg">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Interview Readiness</p>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{result.ai_analysis.interview_readiness}</p>
                              </div>
                              <div className="p-3 bg-neutral-100 dark:bg-[#262626] rounded-lg">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">FAANG Readiness</p>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{result.ai_analysis.faang_readiness}</p>
                              </div>
                              <div className="p-3 bg-neutral-100 dark:bg-[#262626] rounded-lg">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">CP Level</p>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{result.ai_analysis.competitive_programming_level}</p>
                              </div>
                              <div className="p-3 bg-neutral-100 dark:bg-[#262626] rounded-lg">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Open Source</p>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{result.ai_analysis.open_source_level}</p>
                              </div>
                            </div>

                            {result.ai_analysis.strengths.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Strengths</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.ai_analysis.strengths.map((s, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 text-xs bg-neutral-200 dark:bg-green-900/30 text-neutral-700 dark:text-green-400 rounded-full"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default BulkUpload;
