
import type { Request, Response } from "express"; import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { createToken } from '../utils/jwt';
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { blacklistToken } from "../utils/tokenBlackList.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { username }
        });

        if (existing) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            },
        });

        // Generate token
        const token = createToken(user.id, user.username);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = createToken(user.id, user.username);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            //   blacklist the token
            await blacklistToken(token);
        }
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};
