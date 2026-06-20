import { useMutation } from '@tanstack/react-query';
import { analyzeProfiles } from '../services/api';
import { PlatformInput, AnalyzeResponse } from '../types';

export const useAnalyze = () => {
  return useMutation<AnalyzeResponse, Error, PlatformInput>({
    mutationFn: analyzeProfiles,
  });
};
