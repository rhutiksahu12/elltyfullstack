import type { Response } from 'express';
import prisma from '../utils/prisma';
import type { AuthRequest } from '../middleware/auth.middleware.js';


export const getAllTrees = async (req: AuthRequest, res: Response) => {
    try {
        const trees = await prisma.tree.findMany({
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                operations: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        },
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        res.json(trees);
    } catch (error) {
        console.error('Get trees error:', error);
        res.status(500).json({ error: 'Failed to fetch trees' });
    }
};

export const getTreeById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const tree = await prisma.tree.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                operations: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        },
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
            },
        });

        if (!tree) {
            return res.status(404).json({ error: 'Tree not found' });
        }

        res.json(tree);
    } catch (error) {
        console.error('Get tree error:', error);
        res.status(500).json({ error: 'Failed to fetch tree' });
    }
};

export const createTree = async (req: AuthRequest, res: Response) => {
    try {
        const { startNumber } = req.body;

        // Validation
        if (typeof startNumber !== 'number') {
            return res.status(400).json({ error: 'Start number must be a number' });
        }

        if (!isFinite(startNumber)) {
            return res.status(400).json({ error: 'Start number must be a finite number' });
        }

        // Create tree
        const tree = await prisma.tree.create({
            data: {
                startNumber,
                userId: req.user!.userId,
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
            },
        });

        res.status(201).json(tree);
    } catch (error) {
        console.error('Create tree error:', error);
        res.status(500).json({ error: 'Failed to create tree' });
    }
};