import { Router } from 'express';
import { getAdminAnalyticsHandler } from '../controllers/adminController';

const router = Router();

router.get('/analytics', getAdminAnalyticsHandler);

export default router;
