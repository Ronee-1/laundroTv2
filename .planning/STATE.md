# Project State Tracking

## Current Status
- Current Phase: Phase 3 — Dashboard Audit & Manajemen Kuota (REVISION IN PROGRESS).
- Progress: 85% (Backend revisions complete — FR-OWN-02 & FR-FIN-08 implemented. Frontend updates pending).

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
- [x] Final verification: typecheck and build passed 100%.

### Dosen Revision (Backend)
- [x] Update expense.ts with new fields: tanggal, kategori kustom (Gaji/Sewa/Listrik/Logistik/Dana Darurat/Lainnya), bukti_nota_url (FR-FIN-08).
- [x] Update POST /api/expenses/request to accept comprehensive expense schema with date validation (FR-FIN-08).
- [x] Add health_status (Healthy/Warning/Critical) to owner dashboard based on budget utilization (FR-OWN-02).
- [x] Add category_breakdown per branch showing expense distribution by category (FR-OWN-02).
- [x] Add category spike alerts when any category exceeds 40% of total branch expenses (FR-OWN-02).
- [x] Add branches_needing_attention count to dashboard summary (FR-OWN-02).

## Project Summary
**Laundro Truck v2.0** — Multi-branch laundry management system with Hub-and-Spoke architecture.

### Core Features Delivered
1. **Multi-Branch Data Isolation**: Strict `id_cabang` enforcement across all transactions and logistics data.
2. **Static Georouting**: WhatsApp order allocation to nearest branch using Haversine distance.
3. **Order Quota Lock**: Automatic 30-slot daily limit with WhatsApp delay templates.
4. **Auto-Journaling**: Real-time cash book entries tagged with branch ID on order completion.
5. **Overbudget Interception**: Automatic rejection of expense requests exceeding monthly budget ceiling.
6. **Expense Approval Workflow**: Hub admin approval/rejection with real-time budget deduction.
7. **Executive Dashboard**: Consolidated financial analytics per branch with profitability metrics.
8. **Courier Offline Queue**: LocalStorage-based offline resilience with timestamp preservation and auto-sync.
9. **Comprehensive Expense Tracker**: Daily operational expense form with custom categories and receipt upload (FR-FIN-08).
10. **Multi-Branch Analytics**: KPI matrix with health status and category spike detection (FR-OWN-02).

### Architecture
- **Monorepo**: npm workspaces (hub, spokes/*, packages/*)
- **Backend**: Express + TypeScript (hub/)
- **Frontend**: React + Vite (spokes/branch-app/)
- **Shared Types**: @laundrot/shared-types (packages/shared-types/)

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

## Pending Revisions (Dosen Feedback)
- [x] Implement FR-OWN-02: Multi-Branch Analytics Dashboard with KPI data points per branch (BACKEND COMPLETE).
- [x] Implement FR-FIN-08: Comprehensive Expense Tracker form (tanggal, nominal, kategori kustom, cabang asal, bukti nota) (BACKEND COMPLETE).
- [ ] Update frontend DashboardEksekutif to display health_status, category_breakdown, and alerts (FR-OWN-02).
- [ ] Create frontend ExpenseForm component with new schema (FR-FIN-08).
- [ ] Add visual alert/warning system on central dashboard (FRONTEND).
- [ ] Build two-directional Cash Flow report module.
