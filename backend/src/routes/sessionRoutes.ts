import { Router } from 'express';
import { startSessionHandler, completeSessionHandler } from '../controllers/sessionController';

const router = Router();

router.post('/start', startSessionHandler);
router.post('/complete', completeSessionHandler);

export default router;
