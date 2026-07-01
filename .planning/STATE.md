# Project State Tracking

## Current Status
- Current Phase: Phase 2 — Sentralisasi Keuangan & Modul Persediaan.
- Progress: 65% (Auto-journaling to Central Cash Book implemented).

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

## Open Issues / Next Actions
- [ ] Implement emergency expense approval workflow (F05).
- [ ] Implement overbudget interception logic (F06).
- [ ] Add integration tests for auto-journaling and cash book entries.
- [ ] Define shared database schema with mandatory id_cabang indexing.
