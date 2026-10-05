import { Request, Response } from 'express';
import { getTraineeProfile, getTraineeMetrics, getTraineeSessions } from '../services/traineeService';
import { DEFAULT_TRAINEE_ID } from '../services/sessionService';

export async function getTraineeHandler(req: Request, res: Response): Promise<void> {
  try {
    const traineeId = (req.query.id as string) || DEFAULT_TRAINEE_ID;
    const trainee = await getTraineeProfile(traineeId);
    const metrics = await getTraineeMetrics(traineeId);
    const sessions = await getTraineeSessions(traineeId);

    res.json({
      success: true,
      trainee,
      metrics,
      sessions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch trainee details' });
  }
}
