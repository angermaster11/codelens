import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiHackerrank,
} from 'react-icons/si';
import { FiCode, FiGithub, FiAward, FiActivity, FiSearch } from 'react-icons/fi';
import { PlatformInput } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { IconType } from 'react-icons';

interface InputFormProps {
  onSubmit: (input: PlatformInput) => void;
  isLoading: boolean;
}

interface FieldConfig {
  key: keyof PlatformInput;
  label: string;
  icon: IconType;
  placeholder: string;
}

const fields: FieldConfig[] = [
  { key: 'leetcode', label: 'LeetCode', icon: SiLeetcode, placeholder: 'Enter LeetCode username' },
  { key: 'codeforces', label: 'Codeforces', icon: SiCodeforces, placeholder: 'Enter Codeforces handle' },
  { key: 'codechef', label: 'CodeChef', icon: SiCodechef, placeholder: 'Enter CodeChef username' },
  { key: 'hackerrank', label: 'HackerRank', icon: SiHackerrank, placeholder: 'Enter HackerRank username' },
  { key: 'atcoder', label: 'AtCoder', icon: FiAward, placeholder: 'Enter AtCoder username' },
  { key: 'spoj', label: 'SPOJ', icon: FiCode, placeholder: 'Enter SPOJ username' },
  { key: 'hackerearth', label: 'HackerEarth', icon: FiActivity, placeholder: 'Enter HackerEarth username' },
  { key: 'github', label: 'GitHub', icon: FiGithub, placeholder: 'Enter GitHub username' },
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PlatformInput>({});

  const handleChange = (key: keyof PlatformInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasAtLeastOne = Object.values(formData).some(
      (v) => v && v.trim() !== ''
    );
    if (hasAtLeastOne) {
      onSubmit(formData);
    }
  };

  const hasInput = Object.values(formData).some((v) => v && v.trim() !== '');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Analyze Your Coding Profiles
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Enter your usernames across different competitive programming platforms
          and get an AI-powered analysis of your skills and progress.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-neutral-50 dark:bg-[#141414] rounded-2xl border border-neutral-200 dark:border-[#262626] p-6 sm:p-8 shadow-sm dark:shadow-none"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <label
                  htmlFor={field.key}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-[#333] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-white/20 focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
                />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <button
            type="submit"
            disabled={!hasInput}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 dark:disabled:hover:bg-white"
          >
            <FiSearch className="w-5 h-5" />
            Analyze Profiles
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default InputForm;
