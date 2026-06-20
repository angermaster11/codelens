import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-[#262626]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-900 dark:border-t-white border-r-neutral-900 dark:border-r-white" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-neutral-700 dark:text-neutral-300 font-medium"
      >
        Analyzing profiles...
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-neutral-500"
      >
        This may take a moment while we fetch data from multiple platforms
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
