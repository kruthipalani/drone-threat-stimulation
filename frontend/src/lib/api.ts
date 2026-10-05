import { Scenario, TrainingSession, PerformanceReview, TraineeMetrics, AdminAnalytics } from '@/types/database';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  async getHealth() {
    return fetchApi<{ status: string; service: string; database_mode: string }>('/api/health');
  },

  async getScenarios() {
    return fetchApi<{ success: boolean; scenarios: Scenario[] }>('/api/scenarios');
  },

  async getScenarioById(id: string) {
    return fetchApi<{ success: boolean; scenario: Scenario }>(`/api/scenarios/${id}`);
  },

  async generateScenario(params?: { environment?: string; difficulty?: string; threatType?: string }) {
    return fetchApi<{ success: boolean; scenario: Scenario }>('/api/scenarios/generate', {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  },

  async startSession(scenarioId: string, traineeId?: string) {
    return fetchApi<{ success: boolean; sessionToken: string; scenario: Scenario; startedAt: string }>('/api/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ scenarioId, traineeId }),
    });
  },

  async completeSession(payload: {
    scenarioId: string;
    traineeId?: string;
    startedAt: string;
    detectionTime: number;
    classificationSelected: string;
    responseSelected: string;
  }) {
    return fetchApi<{ success: boolean; sessionId: string; session: TrainingSession; review: PerformanceReview }>('/api/sessions/complete', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getTrainee(id?: string) {
    const endpoint = id ? `/api/trainee?id=${id}` : '/api/trainee';
    return fetchApi<{ success: boolean; trainee: any; metrics: TraineeMetrics; sessions: TrainingSession[] }>(endpoint);
  },

  async getAAR(sessionId: string) {
    return fetchApi<{ success: boolean; session: TrainingSession; review: PerformanceReview }>(`/api/aar/${sessionId}`);
  },

  async getAdminAnalytics() {
    return fetchApi<{ success: boolean; analytics: AdminAnalytics }>('/api/admin/analytics');
  }
};
