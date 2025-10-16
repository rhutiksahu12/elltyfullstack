import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        username: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = verifyToken(token);

        if (!payload) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized - Token verification failed' });
    }
};
