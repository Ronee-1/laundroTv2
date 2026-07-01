import express from 'express';
import ordersRouter from './routes/orders.js';
import couriersRouter from './routes/couriers.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'laundrot-hub' });
});

app.use('/api/orders', ordersRouter);
app.use('/api/couriers', couriersRouter);

app.listen(PORT, () => {
  console.log(`[LaundroT Hub] Server running on port ${PORT}`);
});

export default app;
