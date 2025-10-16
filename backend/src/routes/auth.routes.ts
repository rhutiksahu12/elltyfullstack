import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout); 


export default router;