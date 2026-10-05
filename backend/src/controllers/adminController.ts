import { Request, Response } from 'express';
import { getAdminAnalyticsData } from '../services/analyticsService';

export async function getAdminAnalyticsHandler(req: Request, res: Response): Promise<void> {
  try {
    const analytics = await getAdminAnalyticsData();
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch admin analytics' });
  }
}
