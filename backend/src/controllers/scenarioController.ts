import { Request, Response } from 'express';
import { getAllScenarios, getScenario, generateScenario } from '../services/scenarioService';

export async function getScenariosHandler(req: Request, res: Response): Promise<void> {
  try {
    const scenarios = await getAllScenarios();
    res.json({ success: true, scenarios });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scenarios' });
  }
}

export async function getScenarioByIdHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const scenario = await getScenario(id);
    if (!scenario) {
      res.status(404).json({ success: false, error: 'Scenario not found' });
      return;
    }
    res.json({ success: true, scenario });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch scenario' });
  }
}

export async function generateScenarioHandler(req: Request, res: Response): Promise<void> {
  try {
    const scenario = await generateScenario(req.body);
    res.json({ success: true, scenario });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate scenario' });
  }
}
