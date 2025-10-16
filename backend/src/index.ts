import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import treeRoutes from './routes/trees.routes';
import operationRoutes from './routes/operations.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:3000", "https://elltyfullstack.vercel.app", process.env.FRONTEND_URL].filter((origin): origin is string => !!origin);

// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // if using cookies/auth headers
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/operations', operationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});