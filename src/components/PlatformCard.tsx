import { motion } from 'framer-motion';
import { PlatformResult } from '../types';
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiHackerrank,
} from 'react-icons/si';
import { FiCode, FiGithub, FiAward, FiActivity } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface PlatformCardProps {
  result: PlatformResult;
  index: number;
}

const platformConfig: Record<string, { icon: IconType }> = {
  leetcode: { icon: SiLeetcode },
  codeforces: { icon: SiCodeforces },
  codechef: { icon: SiCodechef },
  hackerrank: { icon: SiHackerrank },
  atcoder: { icon: FiAward },
  spoj: { icon: FiCode },
  hackerearth: { icon: FiActivity },
  github: { icon: FiGithub },
};

const PlatformCard: React.FC<PlatformCardProps> = ({ result, index }) => {
  const config = platformConfig[result.platform.toLowerCase()] || { icon: FiCode };
  const Icon = config.icon;
  const isSuccess = result.status === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-neutral-50 dark:bg-[#141414] rounded-2xl p-6 border border-neutral-200 dark:border-[#262626] hover:border-neutral-300 dark:hover:border-[#404040] transition-colors"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#333]">
          <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 dark:text-white capitalize">
            {result.platform}
          </h3>
          <p className="text-sm text-neutral-500">
            @{result.username}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
            isSuccess
              ? 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#333]'
              : 'bg-red-50 dark:bg-[#1a1a1a] text-red-600 dark:text-neutral-500 border-red-200 dark:border-[#333]'
          }`}
        >
          {isSuccess ? 'Connected' : 'Error'}
        </span>
      </div>

      {isSuccess && result.stats && (
        <div className="space-y-2">
          {Object.entries(result.stats).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {Array.isArray(value) ? value.join(', ') : String(value ?? '-')}
              </span>
            </div>
          ))}
        </div>
      )}

      {!isSuccess && (
        <p className="text-sm text-neutral-500">
          Unable to fetch data for this platform
        </p>
      )}
    </motion.div>
  );
};

export default PlatformCard;
