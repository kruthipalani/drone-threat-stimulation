import { Router } from 'express';
import { getTraineeHandler } from '../controllers/traineeController';

const router = Router();

router.get('/', getTraineeHandler);

export default router;
