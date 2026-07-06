import express from 'express';
import ordersRouter from './routes/orders.js';
import couriersRouter from './routes/couriers.js';
import expensesRouter from './routes/expenses.js';
import ownerRouter from './routes/owner.js';
import branchesRouter from './routes/branches.js';
import logisticsRouter from './routes/logistics.js';
import servicesRouter from './routes/services.js';
import restockRequestRouter from './routes/restockRequest.js';

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`[LaundroT Hub] Server running on port ${PORT}`);
});

export default app;
