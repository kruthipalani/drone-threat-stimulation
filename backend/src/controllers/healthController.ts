import { Request, Response } from 'express';
import { isSupabaseConfigured } from '../config/supabase';

export async function healthCheckHandler(req: Request, res: Response): Promise<void> {
  res.json({
    status: 'ok',
    service: 'THRYVE Express Backend',
    organization: 'Ministry of Defence (MoD) - Defence Services Staff College',
    database_mode: isSupabaseConfigured ? 'live_postgresql' : 'demo_seed_mode',
    timestamp: new Date().toISOString()
  });
}
