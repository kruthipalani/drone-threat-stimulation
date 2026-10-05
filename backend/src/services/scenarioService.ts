import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Scenario } from '../models/types';

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Urban Day – Single Recon Quadcopter',
    environment: 'Urban',
    time_condition: 'Day',
    sensor_condition: 'Normal',
    threat_type: 'Single Drone',
    difficulty: 'Easy',
    description: 'High-altitude commercial quadcopter conducting visual reconnaissance over perimeter installation under clear daylight conditions.',
    training_objective: 'Assess visual radar target acquisition and practice prompt threat classification under clean sensor conditions.',
    target_drone_type: 'Commercial Recon Quadcopter',
    target_correct_response: 'TRACK',
    procedural_config: {
      seed: 'SEED_URBAN_EASY_01',
      threat_count: 1,
      movement_pattern: 'Straight',
      sensor_condition: 'Normal',
      decision_window_seconds: 15,
      initial_speed_range: [40, 60],
      visibility_state: 'Clear'
    }
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Rural Day – Dual High-Speed FPV Kamikaze',
    environment: 'Rural',
    time_condition: 'Day',
    sensor_condition: 'Normal',
    threat_type: 'Multiple Drones',
    difficulty: 'Moderate',
    description: 'Two low-flying FPV micro-drones approaching field command outpost across undulating rural terrain at 80 km/h velocity.',
    training_objective: 'Identify fast-moving multi-target trajectories and execute defensive tracking protocols before perimeter breach.',
    target_drone_type: 'FPV Strike Micro-Drone',
    target_correct_response: 'ESCALATE',
    procedural_config: {
      seed: 'SEED_RURAL_MOD_02',
      threat_count: 2,
      movement_pattern: 'Crossing',
      sensor_condition: 'Normal',
      decision_window_seconds: 10,
      initial_speed_range: [70, 90],
      visibility_state: 'Clear'
    }
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'Urban Night – Stealth Surveillance UAV',
    environment: 'Urban',
    time_condition: 'Night',
    sensor_condition: 'Normal',
    threat_type: 'Single Drone',
    difficulty: 'Moderate',
    description: 'Low-noise thermal payload drone navigating city building shadows during nighttime blackout conditions.',
    training_objective: 'Utilize night radar telemetry and thermal sensor queues to achieve early detection despite urban canopy clutter.',
    target_drone_type: 'Tactical Recon UAV',
    target_correct_response: 'TRACK',
    procedural_config: {
      seed: 'SEED_URBAN_NIGHT_03',
      threat_count: 1,
      movement_pattern: 'Straight',
      sensor_condition: 'Normal',
      decision_window_seconds: 10,
      initial_speed_range: [50, 75],
      visibility_state: 'Clear'
    }
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'Rural Night – Electronic Jammed Reconnaissance',
    environment: 'Rural',
    time_condition: 'Night',
    sensor_condition: 'Degraded',
    threat_type: 'Single Drone',
    difficulty: 'Advanced',
    description: 'Heavy electronic counter-measures (ECM) jamming radio frequencies and degrading radar return signals over open fields.',
    training_objective: 'Identify target signature amidst signal noise and issue rapid response under severely degraded sensor feedback.',
    target_drone_type: 'Loitering Munition UAV',
    target_correct_response: 'ESCALATE',
    procedural_config: {
      seed: 'SEED_ECM_ADV_04',
      threat_count: 1,
      movement_pattern: 'Erratic',
      sensor_condition: 'Degraded',
      decision_window_seconds: 6,
      initial_speed_range: [80, 110],
      visibility_state: 'Heavy ECM'
    }
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'Urban Night – Autonomous Micro-Swarm Assault',
    environment: 'Urban',
    time_condition: 'Night',
    sensor_condition: 'Degraded',
    threat_type: 'Swarm',
    difficulty: 'Advanced',
    description: 'Coordinated 8-drone autonomous micro-swarm executing synchronized multi-vector penetration over critical urban asset.',
    training_objective: 'Evaluate swarm attack vectors, maintain tactical composure under time pressure, and execute immediate escalation protocol.',
    target_drone_type: 'Autonomous Micro-Swarm Cluster',
    target_correct_response: 'ESCALATE',
    procedural_config: {
      seed: 'SEED_SWARM_ADV_05',
      threat_count: 8,
      movement_pattern: 'Swarm',
      sensor_condition: 'Degraded',
      decision_window_seconds: 5,
      initial_speed_range: [90, 130],
      visibility_state: 'Intermittent'
    }
  }
];

export async function getAllScenarios(): Promise<Scenario[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('scenarios').select('*').order('name');
    if (!error && data && data.length > 0) return data as Scenario[];
  }
  return DEFAULT_SCENARIOS;
}

export async function getScenario(id: string): Promise<Scenario | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('scenarios').select('*').eq('id', id).single();
    if (!error && data) return data as Scenario;
  }
  return DEFAULT_SCENARIOS.find(s => s.id === id) || null;
}

export async function generateScenario(params?: {
  environment?: string;
  difficulty?: string;
  threatType?: string;
}): Promise<Scenario> {
  const envs: ('Urban' | 'Rural' | 'Open')[] = ['Urban', 'Rural', 'Open'];
  const diffs: ('Easy' | 'Moderate' | 'Advanced')[] = ['Easy', 'Moderate', 'Advanced'];
  const threats: ('Single Drone' | 'Multiple Drones' | 'Swarm')[] = ['Single Drone', 'Multiple Drones', 'Swarm'];
  
  const env = (params?.environment && envs.includes(params.environment as any)) 
    ? (params.environment as any) 
    : envs[Math.floor(Math.random() * envs.length)];

  const difficulty = (params?.difficulty && diffs.includes(params.difficulty as any))
    ? (params.difficulty as any)
    : diffs[Math.floor(Math.random() * diffs.length)];

  const threat = (params?.threatType && threats.includes(params.threatType as any))
    ? (params.threatType as any)
    : threats[Math.floor(Math.random() * threats.length)];

  const threatCount = threat === 'Single Drone' ? 1 : threat === 'Multiple Drones' ? 3 : 8;
  const sensorState = difficulty === 'Advanced' ? 'Degraded' : difficulty === 'Moderate' ? 'Intermittent' : 'Normal';
  const movementPattern = threat === 'Swarm' ? 'Swarm' : threatCount > 1 ? 'Crossing' : 'Straight';
  
  const seed = `PROC_SEED_${Date.now().toString(36).toUpperCase()}`;

  const generatedScenario: Scenario = {
    id: `proc_${Date.now()}`,
    name: `Procedural ${difficulty} – ${env} ${threat}`,
    environment: env,
    time_condition: Math.random() > 0.5 ? 'Night' : 'Day',
    sensor_condition: sensorState,
    threat_type: threat,
    difficulty,
    description: `Procedurally generated encounter with ${threatCount} active target(s) executing ${movementPattern.toLowerCase()} flight trajectory under ${sensorState.toLowerCase()} sensor conditions.`,
    training_objective: `Evaluate rapid multi-target recognition, threat signature classification, and ROE response selection under ${difficulty.toLowerCase()} tactical constraints.`,
    target_drone_type: threat === 'Swarm' ? 'Autonomous Micro-Swarm Cluster' : threatCount > 1 ? 'FPV Strike Micro-Drone' : 'Commercial Recon Quadcopter',
    target_correct_response: threat === 'Swarm' || difficulty === 'Advanced' ? 'ESCALATE' : 'TRACK',
    is_procedural: true,
    procedural_config: {
      seed,
      threat_count: threatCount,
      movement_pattern: movementPattern,
      sensor_condition: sensorState,
      decision_window_seconds: difficulty === 'Advanced' ? 6 : difficulty === 'Moderate' ? 10 : 15,
      initial_speed_range: difficulty === 'Advanced' ? [90, 130] : [50, 80],
      visibility_state: sensorState === 'Degraded' ? 'Heavy ECM' : sensorState === 'Intermittent' ? 'Intermittent' : 'Clear'
    }
  };

  DEFAULT_SCENARIOS.unshift(generatedScenario);
  return generatedScenario;
}
