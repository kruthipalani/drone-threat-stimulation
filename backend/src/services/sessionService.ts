import { supabase, isSupabaseConfigured } from '../config/supabase';
import { TrainingSession, PerformanceReview } from '../models/types';
import { getScenario, DEFAULT_SCENARIOS } from './scenarioService';

export const DEFAULT_TRAINEE_ID = '00000000-0000-0000-0000-000000000001';

export let memorySessions: TrainingSession[] = [
  {
    id: '22222222-2222-2222-2222-222222222204',
    trainee_id: DEFAULT_TRAINEE_ID,
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
    trainee_id: DEFAULT_TRAINEE_ID,
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
    trainee_id: DEFAULT_TRAINEE_ID,
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
    trainee_id: DEFAULT_TRAINEE_ID,
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

export let memoryReviews: PerformanceReview[] = [
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

export async function saveSession(data: {
  trainee_id: string;
  scenario_id: string;
  started_at: string;
  completed_at: string;
  detection_time: number;
  classification_selected: string;
  response_selected: string;
}): Promise<{ session: TrainingSession; review: PerformanceReview }> {
  const scenario = await getScenario(data.scenario_id);
  
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
