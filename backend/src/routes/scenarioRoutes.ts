import { Router } from 'express';
import { getScenariosHandler, getScenarioByIdHandler, generateScenarioHandler } from '../controllers/scenarioController';

const router = Router();

router.get('/', getScenariosHandler);
router.get('/:id', getScenarioByIdHandler);
router.post('/generate', generateScenarioHandler);

export default router;
