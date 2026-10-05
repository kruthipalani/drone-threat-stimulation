import { NextRequest, NextResponse } from 'next/server';
import { generateProceduralScenario } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // Body optional
    }

    const scenario = await generateProceduralScenario(body);

    return NextResponse.json({
      success: true,
      scenario
    });
  } catch (error) {
    console.error('Error generating procedural scenario:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate procedural scenario configuration' },
      { status: 500 }
    );
  }
}
