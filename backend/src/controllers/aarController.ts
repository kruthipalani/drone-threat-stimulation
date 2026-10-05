import { Request, Response } from 'express';
import { getAARBySessionId } from '../services/aarService';

export async function getAARHandler(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;
    const aar = await getAARBySessionId(sessionId);

    if (!aar) {
      res.status(404).json({ success: false, error: 'AAR record not found' });
      return;
    }

    res.json({
      success: true,
      session: aar.session,
      review: aar.review
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve AAR' });
  }
}
