import { Router } from 'express';
import { getAllTrees, createTree, getTreeById } from '../controllers/tree.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllTrees);
router.get('/:id', getTreeById);
router.post('/', authenticate, createTree);

export default router;