"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_js_1 = __importDefault(require("./routes/orders.js"));
const couriers_js_1 = __importDefault(require("./routes/couriers.js"));
const expenses_js_1 = __importDefault(require("./routes/expenses.js"));
const owner_js_1 = __importDefault(require("./routes/owner.js"));
const branches_js_1 = __importDefault(require("./routes/branches.js"));
const logistics_js_1 = __importDefault(require("./routes/logistics.js"));
const services_js_1 = __importDefault(require("./routes/services.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
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
app.listen(PORT, () => {
    console.log(`[LaundroT Hub] Server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map