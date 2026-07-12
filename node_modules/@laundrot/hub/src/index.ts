import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders.js';
import couriersRouter from './routes/couriers.js';
import expensesRouter from './routes/expenses.js';
import ownerRouter from './routes/owner.js';
import branchesRouter from './routes/branches.js';
import logisticsRouter from './routes/logistics.js';
import servicesRouter from './routes/services.js';
import restockRequestRouter from './routes/restockRequest.js';
import authRouter from './routes/auth/index.js';
import { initializeBranchesCache } from './config/branches.js';
import { seedDefaultServices } from './config/services.js';
import { seedDefaultCouriers } from './config/couriers.js';
import { prisma } from './lib/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow frontend access
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
}));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'laundrot-hub' });
});

app.use('/api/orders', ordersRouter);
app.use('/api/couriers', couriersRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/branches', branchesRouter);
app.use('/api/logistics', logisticsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/restock', restockRequestRouter);
app.use('/api/auth', authRouter);

// ============================================================
// STARTUP INITIALIZATION
// ============================================================

async function initializeApp() {
  console.log('[LaundroT Hub] Initializing application...\n');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('[Database] Connected successfully');

    // Initialize branches cache
    await initializeBranchesCache();
    console.log('[Cache] Branches cache initialized');

    // Seed default data (if not exists)
    await seedDefaultServices();
    await seedDefaultCouriers();
    console.log('[Seed] Default data seeded (if needed)\n');

    console.log('[LaundroT Hub] Initialization complete!\n');
  } catch (error) {
    console.error('[LaundroT Hub] Initialization error:', error);
    console.log('[LaundroT Hub] Server will continue without full initialization...\n');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[LaundroT Hub] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[LaundroT Hub] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

// Initialize and start server
initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`[LaundroT Hub] Server running on port ${PORT}`);
    console.log(`[LaundroT Hub] Health check: http://localhost:${PORT}/health`);
  });
});

export default app;
