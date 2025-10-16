import { Router } from 'express';
import { createOperation } from '../controllers/operation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createOperation);

export default router;