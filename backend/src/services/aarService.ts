import { supabase, isSupabaseConfigured } from '../config/supabase';
import { TrainingSession, PerformanceReview } from '../models/types';
import { memorySessions, memoryReviews } from './sessionService';

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
        strengths: ['Standard drill execution recorded'],
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
