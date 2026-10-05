import { supabase, isSupabaseConfigured } from './supabase';
import { 
  Trainee, 
  Scenario, 
  TrainingSession, 
  PerformanceReview, 
  TraineeMetrics, 
  AdminAnalytics,
  ProceduralConfig
} from '@/types/database';

const DEFAULT_TRAINEE: Trainee = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Capt. Vikram Singh',
  unit: '14th Armoured Division',
  role: 'Counter-UAV Tactical Officer',
  created_at: new Date().toISOString(),
};

const DEFAULT_SCENARIOS: Scenario[] = [
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

// Rich multi-drill historical sessions showing clear score improvement trajectory (Drill 1 to Drill 4)
let memorySessions: TrainingSession[] = [
  {
    id: '22222222-2222-2222-2222-222222222204',
    trainee_id: DEFAULT_TRAINEE.id,
    scenario_id: DEFAULT_SCENARIOS[0].id,
    started_at: new Date(Date.now() - 14400000).toISOString(),
    completed_at: new Date(Date.now() - 14300000).toISOString(),
    detection_time: 6.8,
    classification_selected: 'Commercial Recon Quadcopter',
    classification_correct: 'Commercial Recon Quadcopter',
    response_selected: 'MONITOR',
    response_correct: 'TRACK',
    score: 65,
    created_at: new Date(Date.now() - 14300000).toISOString(),
    scenario: DEFAULT_SCENARIOS[0],
    threat_count: 1
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    trainee_id: DEFAULT_TRAINEE.id,
    scenario_id: DEFAULT_SCENARIOS[1].id,
    started_at: new Date(Date.now() - 10800000).toISOString(),
    completed_at: new Date(Date.now() - 10700000).toISOString(),
    detection_time: 5.2,
    classification_selected: 'FPV Strike Micro-Drone',
    classification_correct: 'FPV Strike Micro-Drone',
    response_selected: 'TRACK',
    response_correct: 'ESCALATE',
    score: 78,
    created_at: new Date(Date.now() - 10700000).toISOString(),
    scenario: DEFAULT_SCENARIOS[1],
    threat_count: 2
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    trainee_id: DEFAULT_TRAINEE.id,
    scenario_id: DEFAULT_SCENARIOS[3].id,
    started_at: new Date(Date.now() - 7200000).toISOString(),
    completed_at: new Date(Date.now() - 7100000).toISOString(),
    detection_time: 4.1,
    classification_selected: 'Loitering Munition UAV',
    classification_correct: 'Loitering Munition UAV',
    response_selected: 'ESCALATE',
    response_correct: 'ESCALATE',
    score: 88,
    created_at: new Date(Date.now() - 7100000).toISOString(),
    scenario: DEFAULT_SCENARIOS[3],
    threat_count: 1
  },
  {
    id: '22222222-2222-2222-2222-222222222201',
    trainee_id: DEFAULT_TRAINEE.id,
    scenario_id: DEFAULT_SCENARIOS[0].id,
    started_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date(Date.now() - 3500000).toISOString(),
    detection_time: 3.2,
    classification_selected: 'Commercial Recon Quadcopter',
    classification_correct: 'Commercial Recon Quadcopter',
    response_selected: 'TRACK',
    response_correct: 'TRACK',
    score: 95,
    created_at: new Date(Date.now() - 3500000).toISOString(),
    scenario: DEFAULT_SCENARIOS[0],
    threat_count: 1
  }
];

let memoryReviews: PerformanceReview[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    session_id: '22222222-2222-2222-2222-222222222201',
    strengths: [
      'Optimal target acquisition latency (3.2s)',
      'Accurate threat profile classification',
      'Tactically sound TRACK response selection'
    ],
    weaknesses: [
      'None identified'
    ],
    recommendation: 'Advance to higher difficulty rural night swarm scenarios to test decision speed under multi-target saturation.',
    detection_accuracy_percentage: 95,
    classification_accuracy_percentage: 100,
    response_accuracy_percentage: 100,
    created_at: new Date(Date.now() - 3500000).toISOString()
  }
];

export async function getTrainee(id: string = DEFAULT_TRAINEE.id): Promise<Trainee> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('trainees').select('*').eq('id', id).single();
    if (!error && data) return data as Trainee;
  }
  return DEFAULT_TRAINEE;
}

export async function getScenarios(): Promise<Scenario[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('scenarios').select('*').order('name');
    if (!error && data && data.length > 0) return data as Scenario[];
  }
  return DEFAULT_SCENARIOS;
}

export async function getScenarioById(id: string): Promise<Scenario | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('scenarios').select('*').eq('id', id).single();
    if (!error && data) return data as Scenario;
  }
  return DEFAULT_SCENARIOS.find(s => s.id === id) || null;
}

export async function generateProceduralScenario(params?: {
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

export async function getTraineeSessions(traineeId: string = DEFAULT_TRAINEE.id): Promise<TrainingSession[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*, scenario:scenarios(*)')
      .eq('trainee_id', traineeId)
      .order('completed_at', { ascending: false });
    if (!error && data) return data as TrainingSession[];
  }
  
  return memorySessions
    .filter(s => s.trainee_id === traineeId)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
}

export async function getTraineeMetrics(traineeId: string = DEFAULT_TRAINEE.id): Promise<TraineeMetrics> {
  const sessions = await getTraineeSessions(traineeId);
  
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      averageDetectionTime: 0,
      classificationAccuracy: 0,
      decisionAccuracy: 0,
      currentLevel: 'Novice'
    };
  }

  const totalScore = sessions.reduce((acc, s) => acc + s.score, 0);
  const totalDetTime = sessions.reduce((acc, s) => acc + Number(s.detection_time), 0);
  const correctClassifications = sessions.filter(s => s.classification_selected === s.classification_correct).length;
  const correctDecisions = sessions.filter(s => s.response_selected === s.response_correct).length;

  const avgScore = Math.round(totalScore / sessions.length);
  const avgDetTime = Number((totalDetTime / sessions.length).toFixed(2));
  const classAcc = Math.round((correctClassifications / sessions.length) * 100);
  const decAcc = Math.round((correctDecisions / sessions.length) * 100);

  let primaryGap = 'None - Optimal Performance';
  if (avgDetTime > 4.5) primaryGap = 'Detection Speed Deficit';
  else if (classAcc < 80) primaryGap = 'Classification Profile Mis-match';
  else if (decAcc < 80) primaryGap = 'ROE Response Decision Hesitation';

  let currentLevel = 'Level I - Basic';
  if (sessions.length >= 4 && avgScore > 85) currentLevel = 'Level IV - Tactical Specialist';
  else if (sessions.length >= 3 && avgScore > 75) currentLevel = 'Level III - Skilled Operator';
  else if (sessions.length >= 2) currentLevel = 'Level II - Intermediate';

  return {
    totalSessions: sessions.length,
    averageScore: avgScore,
    averageDetectionTime: avgDetTime,
    classificationAccuracy: classAcc,
    decisionAccuracy: decAcc,
    currentLevel,
    primaryTrainingGap: primaryGap
  };
}

export async function saveTrainingSession(data: {
  trainee_id: string;
  scenario_id: string;
  started_at: string;
  completed_at: string;
  detection_time: number;
  classification_selected: string;
  response_selected: string;
}): Promise<{ session: TrainingSession; review: PerformanceReview }> {
  const scenario = await getScenarioById(data.scenario_id);
  
  const correctClass = scenario?.target_drone_type || 'Commercial Recon Quadcopter';
  const correctResp = scenario?.target_correct_response || 'TRACK';

  const classMatch = data.classification_selected.toLowerCase() === correctClass.toLowerCase();
  const respMatch = data.response_selected.toUpperCase() === correctResp.toUpperCase();

  const classPts = classMatch ? 40 : 15;
  const respPts = respMatch ? 40 : 10;
  const timePts = Math.max(0, Math.min(20, Math.round(20 - (data.detection_time * 1.5))));

  const score = classPts + respPts + timePts;

  const sessionId = isSupabaseConfigured ? undefined : `session_${Date.now()}`;
  const reviewId = isSupabaseConfigured ? undefined : `review_${Date.now()}`;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (data.detection_time <= 4.0) {
    strengths.push(`Prompt target detection latency (${data.detection_time.toFixed(2)}s)`);
  } else {
    weaknesses.push(`Elevated target detection latency (${data.detection_time.toFixed(2)}s)`);
  }

  if (classMatch) {
    strengths.push(`Accurate threat profile classification (${data.classification_selected})`);
  } else {
    weaknesses.push(`Miscalibrated threat profile classification (Selected ${data.classification_selected} vs Expected ${correctClass})`);
  }

  if (respMatch) {
    strengths.push(`Tactically sound ROE response protocol (${data.response_selected})`);
  } else {
    weaknesses.push(`Sub-optimal response label chosen (${data.response_selected} vs Recommended ${correctResp})`);
  }

  // Rule-Based Adaptive Recommendation Engine (Phase 2)
  let recommendation = 'Maintain current routine practice drills to retain high tactical speed.';
  if (data.detection_time > 4.5 && scenario?.sensor_condition === 'Degraded') {
    recommendation = 'Repeat moderate degraded-sensor scenarios to lower target detection latency under ECM electronic noise.';
  } else if (!classMatch) {
    recommendation = 'Select classification-focused drills to practice distinguishing micro-quadcopters from loitering munition threats.';
  } else if (!respMatch) {
    recommendation = 'Re-align on rules of engagement (ROE) escalation hierarchy: MONITOR vs TRACK vs ESCALATE.';
  } else if (score >= 88) {
    recommendation = 'Advance to higher difficulty rural night swarm scenarios to test decision speed under multi-target saturation.';
  }

  const newSession: TrainingSession = {
    id: sessionId || `session_${Date.now()}`,
    trainee_id: data.trainee_id,
    scenario_id: data.scenario_id,
    started_at: data.started_at,
    completed_at: data.completed_at,
    detection_time: data.detection_time,
    classification_selected: data.classification_selected,
    classification_correct: correctClass,
    response_selected: data.response_selected,
    response_correct: correctResp,
    score,
    created_at: data.completed_at,
    scenario: scenario || undefined,
    threat_count: scenario?.procedural_config?.threat_count || 1,
    procedural_seed: scenario?.procedural_config?.seed
  };

  const newReview: PerformanceReview = {
    id: reviewId || `review_${Date.now()}`,
    session_id: newSession.id,
    strengths: strengths.length > 0 ? strengths : ['Executed basic drill protocol without structural error'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['None identified'],
    recommendation,
    detection_accuracy_percentage: Math.min(100, Math.round(100 - (data.detection_time * 5))),
    classification_accuracy_percentage: classMatch ? 100 : 40,
    response_accuracy_percentage: respMatch ? 100 : 30,
    created_at: data.completed_at
  };

  if (isSupabaseConfigured && supabase) {
    const { data: dbSession, error: sErr } = await supabase
      .from('training_sessions')
      .insert({
        trainee_id: data.trainee_id,
        scenario_id: data.scenario_id,
        started_at: data.started_at,
        completed_at: data.completed_at,
        detection_time: data.detection_time,
        classification_selected: data.classification_selected,
        classification_correct: correctClass,
        response_selected: data.response_selected,
        response_correct: correctResp,
        score
      })
      .select()
      .single();

    if (!sErr && dbSession) {
      newSession.id = dbSession.id;
      const { data: dbReview } = await supabase
        .from('performance_reviews')
        .insert({
          session_id: dbSession.id,
          strengths,
          weaknesses,
          recommendation
        })
        .select()
        .single();

      if (dbReview) {
        newReview.id = dbReview.id;
        newReview.session_id = dbSession.id;
      }
    }
  } else {
    memorySessions = [newSession, ...memorySessions];
    memoryReviews = [newReview, ...memoryReviews];
  }

  return { session: newSession, review: newReview };
}

export async function getAARBySessionId(sessionId: string): Promise<{ session: TrainingSession; review: PerformanceReview } | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: session } = await supabase
      .from('training_sessions')
      .select('*, scenario:scenarios(*)')
      .eq('id', sessionId)
      .single();

    const { data: review } = await supabase
      .from('performance_reviews')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (session && review) {
      return {
        session: session as TrainingSession,
        review: review as PerformanceReview
      };
    }
  }

  const session = memorySessions.find(s => s.id === sessionId);
  const review = memoryReviews.find(r => r.session_id === sessionId);

  if (session) {
    const classMatch = session.classification_selected === session.classification_correct;
    const respMatch = session.response_selected === session.response_correct;

    return {
      session,
      review: review || {
        id: `review_${session.id}`,
        session_id: session.id,
        strengths: ['Standard execution recorded'],
        weaknesses: ['Evaluation logged'],
        recommendation: 'Repeat basic scenario to establish baseline performance metrics.',
        detection_accuracy_percentage: Math.min(100, Math.round(100 - (Number(session.detection_time) * 5))),
        classification_accuracy_percentage: classMatch ? 100 : 40,
        response_accuracy_percentage: respMatch ? 100 : 30,
        created_at: session.completed_at
      }
    };
  }

  return null;
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const scenarios = await getScenarios();
  const sessions = isSupabaseConfigured && supabase
    ? (await supabase.from('training_sessions').select('*, scenario:scenarios(*)')).data || memorySessions
    : memorySessions;

  const totalTrainees = 14;
  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / totalSessions) : 0;
  const avgDetTime = totalSessions > 0 ? Number((sessions.reduce((acc, s) => acc + Number(s.detection_time), 0) / totalSessions).toFixed(2)) : 0;
  const correctClassCount = sessions.filter(s => s.classification_selected === s.classification_correct).length;
  const correctRespCount = sessions.filter(s => s.response_selected === s.response_correct).length;

  const avgClassAcc = totalSessions > 0 ? Math.round((correctClassCount / totalSessions) * 100) : 0;
  const avgRespAcc = totalSessions > 0 ? Math.round((correctRespCount / totalSessions) * 100) : 0;
  const avgDetAcc = Math.min(100, Math.round(100 - (avgDetTime * 4)));

  let urban = 0, rural = 0, day = 0, night = 0, degradedSensor = 0, swarm = 0;

  sessions.forEach(s => {
    const sc = s.scenario || scenarios.find(item => item.id === s.scenario_id);
    if (sc) {
      if (sc.environment === 'Urban') urban++;
      if (sc.environment === 'Rural') rural++;
      if (sc.time_condition === 'Day') day++;
      if (sc.time_condition === 'Night') night++;
      if (sc.sensor_condition === 'Degraded') degradedSensor++;
      if (sc.threat_type === 'Swarm') swarm++;
    }
  });

  return {
    totalTrainees,
    totalSessions,
    averageScore: avgScore,
    averageClassificationAccuracy: avgClassAcc,
    averageDetectionTime: avgDetTime,
    skillMatrix: {
      detectionAccuracy: avgDetAcc,
      classificationAccuracy: avgClassAcc,
      responseAccuracy: avgRespAcc
    },
    scenarioUsage: {
      urban,
      rural,
      day,
      night,
      degradedSensor,
      swarm
    },
    commonPerformanceGaps: [
      {
        gap: 'Degraded Sensor Detection Latency Delay',
        description: 'Operators experience a +2.8s detection latency delay under active ECM electronic noise conditions.',
        affectedPercentage: 38,
        severity: 'High'
      },
      {
        gap: 'Autonomous Swarm Escalation Hesitation',
        description: 'Trainees select MONITOR instead of ESCALATE during initial multi-vector swarm penetration.',
        affectedPercentage: 31,
        severity: 'High'
      },
      {
        gap: 'Micro-Quadcopter Threat Profile Misclassification',
        description: 'High-altitude commercial quadcopters are occasionally misidentified as fast FPV strike drones.',
        affectedPercentage: 20,
        severity: 'Medium'
      }
    ]
  };
}
