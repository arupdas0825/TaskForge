'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getProductivityStats,
  getTaskMetrics,
  getTaskCompletionTrend,
  getCategoryAnalysis,
  getProjectAnalysis,
} from '@/services/analytics';
import { ProductivityStats, TaskMetrics } from '@/types';

export function useProductivityStats() {
  return useQuery({
    queryKey: ['productivity-stats'],
    queryFn: getProductivityStats,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTaskMetrics() {
  return useQuery({
    queryKey: ['task-metrics'],
    queryFn: getTaskMetrics,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useTaskCompletionTrend(days: number = 30) {
  return useQuery({
    queryKey: ['task-completion-trend', days],
    queryFn: () => getTaskCompletionTrend(days),
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useCategoryAnalysis() {
  return useQuery({
    queryKey: ['category-analysis'],
    queryFn: getCategoryAnalysis,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useProjectAnalysis() {
  return useQuery({
    queryKey: ['project-analysis'],
    queryFn: getProjectAnalysis,
    refetchInterval: 5 * 60 * 1000,
  });
}
