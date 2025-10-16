import prisma from './prisma';
import { verifyToken } from './jwt';

export async function blacklistToken(token: string): Promise<void> {
    try {
        const payload = verifyToken(token);
        if (!payload) return;

        // expires after 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.tokenBlacklist.create({
            data: {
                token,
                userId: payload.userId,
                expiresAt,
            },
        });
    } catch (error) {
        console.error('Error blacklisting token:', error);
    }
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
    try {
        const blacklisted = await prisma.tokenBlacklist.findUnique({
            where: { token },
        });
        return !!blacklisted;
    } catch (error) {
        console.error('Error checking token blacklist:', error);
        return false;
    }
}

// optional cleanup function
export async function cleanupExpiredTokens(): Promise<void> {
    try {
        await prisma.tokenBlacklist.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    } catch (error) {
        console.error('Error cleaning up tokens:', error);
    }
}