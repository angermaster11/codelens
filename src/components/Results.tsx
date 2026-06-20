import { motion } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import { FiArrowLeft, FiCopy, FiDownload, FiFileText } from 'react-icons/fi';
import { AnalyzeResponse, PlatformResult } from '../types';
import PlatformCard from './PlatformCard';
import RadarChart from './RadarChart';
import { copyToClipboard, downloadJSON, exportPDF } from '../utils/export';

interface ResultsProps {
  data: AnalyzeResponse;
  onBack: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onBack }) => {
  const platforms: PlatformResult[] = [];
  const platformKeys = [
    'leetcode',
    'codeforces',
    'codechef',
    'hackerrank',
    'atcoder',
    'spoj',
    'hackerearth',
    'github',
  ] as const;

  platformKeys.forEach((key) => {
    const result = data[key];
    if (result && result.status !== 'not_provided') {
      platforms.push(result);
    }
  });

  const analysis = data.ai_analysis;

  const scoreItems = [
    { label: 'Overall Score', value: analysis.overall_score },
    { label: 'DSA Strength', value: analysis.dsa_strength },
    { label: 'Competitive Programming', value: analysis.competitive_programming_level },
    { label: 'Open Source', value: analysis.open_source_level },
    { label: 'Interview Readiness', value: analysis.interview_readiness },
    { label: 'FAANG Readiness', value: analysis.faang_readiness },
  ];

  const allListItems = [
    ...analysis.strengths.map((s) => ({ type: 'strength', text: s })),
    ...analysis.weaknesses.map((w) => ({ type: 'weakness', text: w })),
    ...analysis.recommended_topics.map((t) => ({ type: 'topic', text: t })),
    ...analysis.next_steps.map((n) => ({ type: 'step', text: n })),
  ];

  const useVirtualization = allListItems.length > 20;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Actions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] hover:bg-neutral-200 dark:hover:bg-[#262626] text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(data)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] hover:bg-neutral-200 dark:hover:bg-[#262626] text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors"
          >
            <FiCopy className="w-4 h-4" />
            Copy JSON
          </button>
          <button
            onClick={() => downloadJSON(data, `codelens-${data.username}.json`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] hover:bg-neutral-200 dark:hover:bg-[#262626] text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            Download JSON
          </button>
          <button
            onClick={() => exportPDF(data)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all"
          >
            <FiFileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </motion.div>

      {/* Platform Cards Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Platform Results
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform, index) => (
            <PlatformCard key={platform.platform} result={platform} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Radar Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-neutral-50 dark:bg-[#141414] rounded-2xl border border-neutral-200 dark:border-[#262626] p-6"
      >
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Skills Radar
        </h2>
        <RadarChart analysis={analysis} />
      </motion.section>

      {/* Score Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Scores
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {scoreItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-neutral-50 dark:bg-[#141414] rounded-2xl border border-neutral-200 dark:border-[#262626] p-4 text-center"
            >
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AI Analysis Details */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-neutral-50 dark:bg-[#141414] rounded-2xl border border-neutral-200 dark:border-[#262626] p-6"
      >
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
          AI Analysis
        </h2>

        {useVirtualization ? (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              All Insights ({allListItems.length} items)
            </h3>
            <List
              height={400}
              itemCount={allListItems.length}
              itemSize={48}
              width="100%"
              className="rounded-xl"
            >
              {({ index, style }) => {
                const item = allListItems[index];
                const labelMap: Record<string, string> = {
                  strength: 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#333]',
                  weakness: 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-[#333]',
                  topic: 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#333]',
                  step: 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#333]',
                };
                return (
                  <div style={style} className="flex items-center gap-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${labelMap[item.type]}`}
                    >
                      {item.type}
                    </span>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                      {item.text}
                    </span>
                  </div>
                );
              }}
            </List>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white mt-1.5 shrink-0" />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-1.5 shrink-0" />
                    {w}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Recommended Topics
              </h3>
              <ul className="space-y-2">
                {analysis.recommended_topics.map((t, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1.5 shrink-0" />
                    {t}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Next Steps
              </h3>
              <ul className="space-y-2">
                {analysis.next_steps.map((n, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1.5 shrink-0" />
                    {n}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {analysis.personalized_feedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-4 rounded-xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#262626]"
          >
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Personalized Feedback
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {analysis.personalized_feedback}
            </p>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default Results;
