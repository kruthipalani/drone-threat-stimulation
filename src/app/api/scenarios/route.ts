import { NextResponse } from 'next/server';
import { getScenarios } from '@/lib/db';

export async function GET() {
  try {
    const scenarios = await getScenarios();
    return NextResponse.json({ success: true, scenarios });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scenarios' },
      { status: 500 }
    );
  }
}
