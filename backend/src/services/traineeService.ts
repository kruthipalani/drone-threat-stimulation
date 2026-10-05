import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Trainee, TrainingSession, TraineeMetrics } from '../models/types';
import { DEFAULT_TRAINEE_ID, memorySessions } from './sessionService';

export const DEFAULT_TRAINEE: Trainee = {
  id: DEFAULT_TRAINEE_ID,
  name: 'Capt. Vikram Singh',
  unit: '14th Armoured Division',
  role: 'Counter-UAV Tactical Officer',
  created_at: new Date().toISOString(),
};

export async function getTraineeProfile(id: string = DEFAULT_TRAINEE_ID): Promise<Trainee> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('trainees').select('*').eq('id', id).single();
    if (!error && data) return data as Trainee;
  }
  return DEFAULT_TRAINEE;
}

export async function getTraineeSessions(traineeId: string = DEFAULT_TRAINEE_ID): Promise<TrainingSession[]> {
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

export async function getTraineeMetrics(traineeId: string = DEFAULT_TRAINEE_ID): Promise<TraineeMetrics> {
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
