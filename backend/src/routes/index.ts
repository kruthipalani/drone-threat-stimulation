import { Router } from 'express';
import scenarioRoutes from './scenarioRoutes';
import sessionRoutes from './sessionRoutes';
import traineeRoutes from './traineeRoutes';
import aarRoutes from './aarRoutes';
import adminRoutes from './adminRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/sessions', sessionRoutes);
router.use('/trainee', traineeRoutes);
router.use('/aar', aarRoutes);
router.use('/admin', adminRoutes);

export default router;
