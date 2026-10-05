import { Router } from 'express';
import { healthCheckHandler } from '../controllers/healthController';

const router = Router();

router.get('/', healthCheckHandler);

export default router;
