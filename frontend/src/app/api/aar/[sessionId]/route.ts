import { NextRequest, NextResponse } from 'next/server';
import { getAARBySessionId } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const aar = await getAARBySessionId(sessionId);

    if (!aar) {
      return NextResponse.json(
        { success: false, error: 'After-Action Review record not found for this session ID' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: aar.session,
      review: aar.review
    });
  } catch (error) {
    console.error('Error fetching AAR data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve After-Action Review' },
      { status: 500 }
    );
  }
}
