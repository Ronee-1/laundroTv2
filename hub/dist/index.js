"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const orders_js_1 = __importDefault(require("./routes/orders.js"));
const couriers_js_1 = __importDefault(require("./routes/couriers.js"));
const expenses_js_1 = __importDefault(require("./routes/expenses.js"));
const owner_js_1 = __importDefault(require("./routes/owner.js"));
const branches_js_1 = __importDefault(require("./routes/branches.js"));
const logistics_js_1 = __importDefault(require("./routes/logistics.js"));
const services_js_1 = __importDefault(require("./routes/services.js"));
const restockRequest_js_1 = __importDefault(require("./routes/restockRequest.js"));
const index_js_1 = __importDefault(require("./routes/auth/index.js"));
const branches_js_2 = require("./config/branches.js");
const services_js_2 = require("./config/services.js");
const couriers_js_2 = require("./config/couriers.js");
const prisma_js_1 = require("./lib/prisma.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// CORS Configuration - Allow frontend access
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
}));
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'laundrot-hub' });
});
app.use('/api/orders', orders_js_1.default);
app.use('/api/couriers', couriers_js_1.default);
app.use('/api/expenses', expenses_js_1.default);
app.use('/api/owner', owner_js_1.default);
app.use('/api/branches', branches_js_1.default);
app.use('/api/logistics', logistics_js_1.default);
app.use('/api/services', services_js_1.default);
app.use('/api/restock', restockRequest_js_1.default);
app.use('/api/auth', index_js_1.default);
// ============================================================
// STARTUP INITIALIZATION
// ============================================================
async function initializeApp() {
    console.log('[LaundroT Hub] Initializing application...\n');
    try {
        // Test database connection
        await prisma_js_1.prisma.$connect();
        console.log('[Database] Connected successfully');
        // Initialize branches cache
        await (0, branches_js_2.initializeBranchesCache)();
        console.log('[Cache] Branches cache initialized');
        // Seed default data (if not exists)
        await (0, services_js_2.seedDefaultServices)();
        await (0, couriers_js_2.seedDefaultCouriers)();
        console.log('[Seed] Default data seeded (if needed)\n');
        console.log('[LaundroT Hub] Initialization complete!\n');
    }
    catch (error) {
        console.error('[LaundroT Hub] Initialization error:', error);
        console.log('[LaundroT Hub] Server will continue without full initialization...\n');
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n[LaundroT Hub] Shutting down...');
    await prisma_js_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n[LaundroT Hub] Shutting down...');
    await prisma_js_1.prisma.$disconnect();
    process.exit(0);
});
// Initialize and start server
initializeApp().then(() => {
    app.listen(PORT, () => {
        console.log(`[LaundroT Hub] Server running on port ${PORT}`);
        console.log(`[LaundroT Hub] Health check: http://localhost:${PORT}/health`);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map