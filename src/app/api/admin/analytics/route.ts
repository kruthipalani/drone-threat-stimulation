import { NextResponse } from 'next/server';
import { getAdminAnalytics } from '@/lib/db';

export async function GET() {
  try {
    const analytics = await getAdminAnalytics();
    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch instructor dashboard analytics' },
      { status: 500 }
    );
  }
}
