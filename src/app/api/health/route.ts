import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      service: 'THRYVE | Drone Threat Simulation Trainer',
      organization: 'Ministry of Defence (MoD) - Defence Services Staff College',
      database_mode: isSupabaseConfigured ? 'live_postgresql' : 'demo_seed_mode',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Health check failed' },
      { status: 500 }
    );
  }
}
