import { Request, Response } from 'express';
import { getScenario } from '../services/scenarioService';
import { saveSession, DEFAULT_TRAINEE_ID } from '../services/sessionService';
import { getTraineeProfile } from '../services/traineeService';

export async function startSessionHandler(req: Request, res: Response): Promise<void> {
  try {
    const { scenarioId, traineeId } = req.body;
    if (!scenarioId) {
      res.status(400).json({ success: false, error: 'Scenario ID is required' });
      return;
    }

    const scenario = await getScenario(scenarioId);
    if (!scenario) {
      res.status(404).json({ success: false, error: 'Scenario not found' });
      return;
    }

    const trainee = await getTraineeProfile(traineeId || DEFAULT_TRAINEE_ID);
    const startedAt = new Date().toISOString();

    res.json({
      success: true,
      sessionToken: `token_${Date.now()}`,
      scenario,
      trainee,
      startedAt
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start session' });
  }
}

export async function completeSessionHandler(req: Request, res: Response): Promise<void> {
  try {
    const {
      traineeId,
      scenarioId,
      startedAt,
      detectionTime,
      classificationSelected,
      responseSelected
    } = req.body;

    if (!scenarioId || detectionTime === undefined || !classificationSelected || !responseSelected) {
      res.status(400).json({ success: false, error: 'Missing required session parameters' });
      return;
    }

    const completedAt = new Date().toISOString();

    const { session, review } = await saveSession({
      trainee_id: traineeId || DEFAULT_TRAINEE_ID,
      scenario_id: scenarioId,
      started_at: startedAt || new Date(Date.now() - 30000).toISOString(),
      completed_at: completedAt,
      detection_time: Number(detectionTime),
      classification_selected: classificationSelected,
      response_selected: responseSelected
    });

    res.json({
      success: true,
      sessionId: session.id,
      session,
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to record session' });
  }
}
