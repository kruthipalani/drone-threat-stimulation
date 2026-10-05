export type EnvironmentType = 'Urban' | 'Rural' | 'Open';
export type TimeConditionType = 'Day' | 'Night';
export type SensorConditionType = 'Normal' | 'Degraded' | 'Intermittent';
export type ThreatType = 'Single Drone' | 'Multiple Drones' | 'Swarm';
export type DifficultyType = 'Easy' | 'Moderate' | 'Advanced';
export type MovementPatternType = 'Straight' | 'Crossing' | 'Erratic' | 'Swarm';

export interface ProceduralConfig {
  seed: string;
  threat_count: number;
  movement_pattern: MovementPatternType;
  sensor_condition: SensorConditionType;
  decision_window_seconds: number;
  initial_speed_range: [number, number];
  visibility_state: 'Clear' | 'Pulsing' | 'Intermittent' | 'Heavy ECM';
}

export interface Trainee {
  id: string;
  name: string;
  unit: string;
  role: string;
  created_at: string;
}

export interface Scenario {
  id: string;
  name: string;
  environment: EnvironmentType;
  time_condition: TimeConditionType;
  sensor_condition: SensorConditionType;
  threat_type: ThreatType;
  difficulty: DifficultyType;
  description: string;
  training_objective: string;
  created_at?: string;
  target_drone_type?: string;
  target_correct_response?: string;
  is_procedural?: boolean;
  procedural_config?: ProceduralConfig;
}

export interface TrainingSession {
  id: string;
  trainee_id: string;
  scenario_id: string;
  started_at: string;
  completed_at: string;
  detection_time: number;
  classification_selected: string;
  classification_correct: string;
  response_selected: string;
  response_correct: string;
  score: number;
  created_at: string;
  scenario?: Scenario;
  threat_count?: number;
  procedural_seed?: string;
}

export interface PerformanceReview {
  id: string;
  session_id: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  detection_accuracy_percentage?: number;
  classification_accuracy_percentage?: number;
  response_accuracy_percentage?: number;
  created_at: string;
}

export interface TraineeMetrics {
  totalSessions: number;
  averageScore: number;
  averageDetectionTime: number;
  classificationAccuracy: number;
  decisionAccuracy: number;
  currentLevel: string;
  primaryTrainingGap?: string;
}

export interface AdminAnalytics {
  totalTrainees: number;
  totalSessions: number;
  averageScore: number;
  averageClassificationAccuracy: number;
  averageDetectionTime: number;
  skillMatrix: {
    detectionAccuracy: number;
    classificationAccuracy: number;
    responseAccuracy: number;
  };
  scenarioUsage: {
    urban: number;
    rural: number;
    day: number;
    night: number;
    degradedSensor: number;
    swarm: number;
  };
  commonPerformanceGaps: {
    gap: string;
    description: string;
    affectedPercentage: number;
    severity: 'High' | 'Medium' | 'Low';
  }[];
}
