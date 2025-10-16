import type { Response } from 'express';
import prisma from '../utils/prisma';
import { calculateResult } from '../utils/calculations.ts';
import type { AuthRequest } from '../middleware/auth.middleware.ts';

export const createOperation = async (req: AuthRequest, res: Response) => {
    try {
        const { treeId, parentId, operationType, operand } = req.body;

        // Validation
        if (!treeId || !operationType || typeof operand !== 'number') {
            return res.status(400).json({ error: 'Invalid input - treeId, operationType, and operand are required' });
        }

        const validOperations = ['add', 'subtract', 'multiply', 'divide'];
        if (!validOperations.includes(operationType)) {
            return res.status(400).json({ error: 'Invalid operation type. Must be: add, subtract, multiply, or divide' });
        }

        if (!isFinite(operand)) {
            return res.status(400).json({ error: 'Operand must be a finite number' });
        }

        // Get the tree
        const tree = await prisma.tree.findUnique({
            where: { id: treeId }
        });

        if (!tree) {
            return res.status(404).json({ error: 'Tree not found' });
        }

        // Get previous result
        let previousResult = tree.startNumber;

        if (parentId) {
            const parent = await prisma.operation.findUnique({
                where: { id: parentId }
            });

            if (!parent) {
                return res.status(404).json({ error: 'Parent operation not found' });
            }

            if (parent.treeId !== treeId) {
                return res.status(400).json({ error: 'Parent operation does not belong to this tree' });
            }

            previousResult = parent.result;
        }

        // Calculate result
        let result: number;
        try {
            result = calculateResult(previousResult, operationType, operand);

            if (!isFinite(result)) {
                return res.status(400).json({ error: 'Calculation resulted in invalid number' });
            }
        } catch (error: any) {
            if (error.message === 'Division by zero') {
                return res.status(400).json({ error: 'Division by zero is not allowed' });
            }
            throw error;
        }

        // Create operation
        const operation = await prisma.operation.create({
            data: {
                treeId,
                parentId: parentId || null,
                userId: req.user!.userId,
                operationType,
                operand,
                result,
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
            },
        });

        res.status(201).json(operation);
    } catch (error: any) {
        console.error('Create operation error:', error);
        res.status(500).json({ error: 'Failed to create operation' });
    }
};
