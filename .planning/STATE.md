# Project State Tracking

## Current Status
- Current Phase: Phase 3 — Dashboard Audit & Manajemen Kuota (COMPLETED WITH V1.1 PROTOTYPE MIGRATION).
- Progress: 100% (Project Completed — full prototype-to-monorepo migration done: backend logic, frontend UI, dark theme, modals, role switching, interactive map).

## Completed Tasks
- [x] AGENTS.md implementation with strict business rules.
- [x] .planning/PROJECT.md created.
- [x] .planning/REQUIREMENTS.md created.
- [x] .planning/ROADMAP.md created.
- [x] Initialize Node.js + TypeScript npm workspaces monorepo structure.
- [x] Create packages/shared-types with core data models (Order, Branch, Courier, Transaction).
- [x] Initialize hub/ Express backend with TypeScript.
- [x] Implement POST /api/orders/allocate with Static Georouting (Haversine distance).
- [x] Implement Order Quota Lock (30 daily slots) with WhatsApp delay template.
- [x] Implement GET /api/couriers/:id_kurir/tasks with strict branch data isolation (NF01).
- [x] Create spokes/branch-app/ React frontend with Tugas Harian page (FR-LOG-03).
- [x] Implement PATCH /api/orders/:id_order/status endpoint.
- [x] Implement auto-journaling logic (Selesai/Lunas → CashBookEntry with id_cabang tag).
- [x] Create cashbook service (hub/src/services/cashbook.ts) with mock storage.
- [x] Create budget service (hub/src/services/budget.ts) with monthly budget ceilings per branch.
- [x] Create expense service (hub/src/services/expense.ts) with approval workflow.
- [x] Implement POST /api/expenses/request with overbudget interception (400 Bad Request).
- [x] Implement PATCH /api/expenses/:id_expense/approve for Hub admin approval.
- [x] Implement GET /api/owner/dashboard with per-branch financial consolidation (FR-OWN-01).
- [x] Create Dashboard Keuangan Eksekutif page with cash flow visualization.
- [x] Implement offline queue system for courier status updates (NF03).
- [x] Update TugasHarian.tsx with offline detection, queue management, and auto-sync.
- [x] Tailwind CSS integration for polished UI.

### Dosen Revision — Backend (FR-OWN-02 & FR-FIN-08)
- [x] Update expense.ts with new fields: tanggal, kategori kustom (Gaji/Sewa/Listrik/Logistik/Dana Darurat/Lainnya), bukti_nota_url.
- [x] Update POST /api/expenses/request to accept comprehensive expense schema with date validation.
- [x] Add health_status (Healthy/Warning/Critical) to owner dashboard based on budget utilization.
- [x] Add category_breakdown per branch showing expense distribution by category.
- [x] Add category spike alerts when any category exceeds 40% of total branch expenses.
- [x] Add branches_needing_attention count to dashboard summary.

### Dosen Revision — Frontend (FR-OWN-02 & FR-FIN-08)
- [x] Update DashboardEksekutif with HealthStatusBadge (green/yellow/red) per branch.
- [x] Add AlertsBox component showing Critical/Warning branches and category spike alerts.
- [x] Add CategoryBreakdown visual bar chart per branch in dashboard table.
- [x] Create ExpenseForm component with date picker, nominal, kategori dropdown, cabang selector, bukti nota URL.
- [x] ExpenseForm connected to POST /api/expenses/request with Overbudget Error popup.
- [x] Add "Pengeluaran" tab to App navigation.
- [x] Final typecheck and build passed 100%.

### V1.1 Prototype Migration — Backend (COMPLETED)
- [x] Migrate INITIAL_BRANCHES data from prototype: 5 branches with omzet, wilayah, and real Jabodetabek coordinates.
- [x] Update budget service with prototype pagu values (CBG-001: 5M, CBG-002: 5M, CBG-003: 4M, CBG-004: 4.5M, CBG-005: 4M).
- [x] Update expense service with new categories from prototype: BBM, Sewa & Utilitas, Gaji, Belanja Darurat, Pemeliharaan, Lain-lain.
- [x] Seed 4 initial expenses from prototype (EXP-SEED-001 through EXP-SEED-004).
- [x] Update inventory service with prototype stock values and safety thresholds (Detergen/Pelembut/Plastik per branch).
- [x] Add restockInventory() function to inventory service.
- [x] Update POST /api/expenses/request with exact Rule 11 message: "PROSES DITOLAK: Overbudget!" with formatIDR.
- [x] Add GET /api/expenses/categories and POST /api/expenses/categories endpoints for custom category management.
- [x] Update POST /api/branches/:id_cabang/reconcile to calculate kas_digital = omzet - totalApprovedExpenses (no more random).
- [x] Add discrepancy detection messages matching prototype: "AUDIT BERHASIL" / "LOG SELISIH DITERBITKAN".
- [x] Add POST /api/branches/:id_cabang/restock endpoint for inventory restocking.
- [x] Add GET /api/branches/:id_cabang/inventory endpoint.
- [x] Update owner dashboard to include omzet, wilayah, and total_omzet in summary.

### V1.1 Prototype Migration — Frontend (COMPLETED)
- [x] Full dark theme UI: Navy Blue primary, Slate Gray neutral, Emerald/Amber/Rose status indicators.
- [x] App.tsx: Role switcher (Owner / Admin Cabang) with branch selector and notification toast system.
- [x] Sidebar: Dark theme with slate-950 background, cyan-400 active state, module navigation labels matching prototype.
- [x] DashboardEksekutif: Two-column layout — left: interactive spatial map with x,y coordinates; right: drill-down panel detail.
- [x] Interactive map with 5 branch markers positioned by prototype coordinates, hover tooltips, click-to-select drill-down.
- [x] Drill-down panel: financial health bars, stock details (Detergen/Pelembut/Plastik with safety thresholds), action buttons.
- [x] KPI summary cards: Konsolidasi Omzet, Total Pengeluaran, Profit Bersih, Cabang Kritis.
- [x] Matriks Performa Komparasi table with status badges, stock indicators, and branch health.
- [x] ExpenseForm: Full expense tracker page with search, branch filter, category filter, log table.
- [x] ExpenseModal: Modal form with branch selector, custom category dropdown, nominal, date, description.
- [x] CategoryModal: Modal for adding custom expense categories via POST /api/expenses/categories.
- [x] RestockModal: Modal for inventory restocking (Detergen/Pelembut/Plastik) via POST /api/branches/:id/restock.
- [x] AuditRekonsiliasi: Two-column layout — form input + procedure guide + live result display.
- [x] InventarisPemantau: Stock monitoring cards with progress bars, safety thresholds, restock buttons.
- [x] JabodetabekMap: Updated with dark theme, x,y coordinate positioning, hover tooltips.
- [x] Final typecheck passed 100% (all 3 workspaces: hub, branch-app, shared-types).
- [x] Final build passed 100% (Vite production bundle: 211KB JS + 29KB CSS).

## Project Summary
**Laundro Truck v2.0** — Multi-branch laundry management system with Hub-and-Spoke architecture.

### Core Features Delivered
1. **Multi-Branch Data Isolation**: Strict `id_cabang` enforcement across all transactions and logistics data.
2. **Static Georouting**: WhatsApp order allocation to nearest branch using Haversine distance.
3. **Order Quota Lock**: Automatic 30-slot daily limit with WhatsApp delay templates.
4. **Auto-Journaling**: Real-time cash book entries tagged with branch ID on order completion.
5. **Overbudget Interception**: Automatic rejection with "PROSES DITOLAK: Overbudget!" message (Rule 11).
6. **Expense Approval Workflow**: Hub admin approval/rejection with real-time budget deduction.
7. **Executive Dashboard**: Two-column monitoring with interactive spatial map and drill-down panels.
8. **Courier Offline Queue**: LocalStorage-based offline resilience with timestamp preservation and auto-sync.
9. **Comprehensive Expense Tracker**: Daily expense form with custom categories, search, filters, and log table.
10. **Multi-Branch Analytics**: KPI matrix with health status badges, stock indicators, and performance comparison.
11. **Interactive Jabodetabek Map**: Spatial map with x,y coordinate markers, hover tooltips, click-to-drill-down.
12. **Inventory Monitoring**: Stock tracking (detergen, pelembut, plastik) with safety thresholds, progress bars, and restock modals.
13. **Cash Reconciliation Audit**: Physical vs digital cash input with omzet-based calculation and discrepancy detection.
14. **Role-Based Access**: Owner/Admin Cabang simulation with branch-scoped data visibility.
15. **Custom Category Management**: Dynamic expense category creation via API.
16. **Inventory Restock**: Branch-level stock replenishment via modal form and API endpoint.

### Architecture
- **Monorepo**: npm workspaces (hub, spokes/*, packages/*)
- **Backend**: Express + TypeScript (hub/)
- **Frontend**: React + Vite + Tailwind CSS (spokes/branch-app/)
- **Shared Types**: @laundrot/shared-types (packages/shared-types/)

### UI/UX Design System
- **Theme**: Dark mode — slate-900/950 backgrounds
- **Primary**: Navy Blue (cyan-600 accents)
- **Neutral**: Slate Gray palette (50–950)
- **Status Indicators**: Emerald (Aman/Success), Amber (Warning/Perhatian), Rose (Critical/Error)
- **Cards**: Rounded-2xl corners, slate-800 borders, subtle shadows
- **Typography**: Black/bold headings, mono-spaced financial figures

### Compliance
- UU PDP No. 27 Tahun 2022 (data encryption requirements documented)
- No hardcoded API keys or branch coordinates
- Strict branch isolation enforced at API level

## Next Steps (Post-MVP)
- [ ] Database integration (PostgreSQL/MySQL with encrypted fields)
- [ ] Service Worker implementation for full PWA offline support
- [ ] Integration test suite for all edge cases
- [ ] Production deployment configuration
- [ ] Real-time WebSocket notifications for admin dashboard
