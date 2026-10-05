import { NextRequest, NextResponse } from 'next/server';
import { saveTrainingSession } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      traineeId,
      scenarioId,
      startedAt,
      detectionTime,
      classificationSelected,
      responseSelected
    } = body;

    if (!scenarioId || detectionTime === undefined || !classificationSelected || !responseSelected) {
      return NextResponse.json(
        { success: false, error: 'Missing required session performance metrics' },
        { status: 400 }
      );
    }

    const completedAt = new Date().toISOString();

    const { session, review } = await saveTrainingSession({
      trainee_id: traineeId || '00000000-0000-0000-0000-000000000001',
      scenario_id: scenarioId,
      started_at: startedAt || new Date(Date.now() - 30000).toISOString(),
      completed_at: completedAt,
      detection_time: Number(detectionTime),
      classification_selected: classificationSelected,
      response_selected: responseSelected
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      session,
      review
    });
  } catch (error) {
    console.error('Error completing training session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record session performance' },
      { status: 500 }
    );
  }
}
