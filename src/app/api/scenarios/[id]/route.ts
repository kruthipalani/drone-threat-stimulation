import { NextRequest, NextResponse } from 'next/server';
import { getScenarioById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scenario = await getScenarioById(id);
    
    if (!scenario) {
      return NextResponse.json(
        { success: false, error: 'Scenario not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, scenario });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scenario details' },
      { status: 500 }
    );
  }
}
