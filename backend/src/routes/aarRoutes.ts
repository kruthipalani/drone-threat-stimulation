import { Router } from 'express';
import { getAARHandler } from '../controllers/aarController';

const router = Router();

router.get('/:sessionId', getAARHandler);

export default router;
