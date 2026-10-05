import { NextRequest, NextResponse } from 'next/server';
import { getScenarioById, getTrainee } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioId, traineeId } = body;

    if (!scenarioId) {
      return NextResponse.json(
        { success: false, error: 'Scenario ID is required' },
        { status: 400 }
      );
    }

    const scenario = await getScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { success: false, error: 'Invalid scenario ID' },
        { status: 404 }
      );
    }

    const trainee = await getTrainee(traineeId);

    const startedAt = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      sessionToken: `token_${Date.now()}`,
      scenario,
      trainee,
      startedAt
    });
  } catch (error) {
    console.error('Error starting training session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate training session' },
      { status: 500 }
    );
  }
}
