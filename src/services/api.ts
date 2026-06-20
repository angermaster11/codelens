import axios from 'axios';
import { PlatformInput, AnalyzeResponse, BulkResult } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeProfiles = async (
  input: PlatformInput
): Promise<AnalyzeResponse> => {
  const { data } = await api.post<AnalyzeResponse>('/analyze', input);
  return data;
};

export const bulkAnalyze = async (file: File): Promise<BulkResult[]> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<BulkResult[]>('/bulk-analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export default api;
