import { NextRequest, NextResponse } from 'next/server';
import { getTrainee, getTraineeMetrics, getTraineeSessions } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const traineeId = searchParams.get('id') || '00000000-0000-0000-0000-000000000001';

    const trainee = await getTrainee(traineeId);
    const metrics = await getTraineeMetrics(traineeId);
    const sessions = await getTraineeSessions(traineeId);

    return NextResponse.json({
      success: true,
      trainee,
      metrics,
      sessions
    });
  } catch (error) {
    console.error('Error fetching trainee profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trainee details' },
      { status: 500 }
    );
  }
}
