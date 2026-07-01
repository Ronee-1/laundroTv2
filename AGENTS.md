# AGENTS.md

## Project

laundroT — multi-branch web application using a Hub-and-Spoke architecture. Each spoke is a branch-specific deployment; the hub coordinates shared logic.

## Stack

- **Runtime**: Node.js + TypeScript
- **Frontend**: React
- **Backend**: Express
- **Structure**: npm workspaces monorepo

## Commands

```bash
npm run dev          # start dev servers
npm run build        # build all packages
npm run test         # run all tests
npm run lint         # lint all packages
npm run typecheck    # type-check all packages
```

Run for a single workspace: `npm run <script> -w <package-name>`

## Architecture

- **hub/**: shared backend services, core business logic, shared API routes
- **spokes/**: branch-specific frontend apps and configuration overrides
- **packages/**: shared libraries (types, utils, UI components) consumed by hub and spokes

Hub-and-Spoke means: spokes depend on hub, never the reverse. Spokes must not import from other spokes.

## Conventions

- Dependency direction: `spokes/* → hub → packages/*`. No spoke-to-spoke imports.
- Shared types live in a dedicated types package, not in hub or spoke code.
- Each spoke has its own config/env; never hardcode spoke-specific values in hub code.

## Strict Business Rules

### Multi-Branch Data Isolation
- Every financial transaction and logistics log MUST include `id_cabang` (branch ID) as a database index.
- Branch Admins and Couriers can ONLY access data for their own `id_cabang`. Cross-branch data leaks are a severe violation.

### Financial & Budget Constraints
- **Auto-Journal**: When an order status changes to "Selesai/Lunas" at a Spoke, the backend must immediately journal the entry into the Hub's Central Cash Book, tagged with the origin branch ID.
- **Overbudget Interception**: Any local operational expense request from a Spoke that exceeds the remaining monthly budget ceiling allocated by the Hub MUST be blocked automatically (`Overbudget Error`).
- **Closing Discrepancy**: If daily physical cash closing input does not match digital records in the Hub, the system must emit a "Discrepancy" alert to the Owner dashboard and FREEZE the Spoke's order input rights immediately.

### Logistics & Edge Cases
- **Static Georouting**: Central WhatsApp orders must be routed to the nearest branch based on geographical coordinates input by the Central Admin.
- **Order Quota Lock**: If a branch hits its daily courier quota (e.g., 30/30 slots), the system must automatically lock new orders for that area and reschedule them to the next day with a notification template.
- **Courier Offline Queue**: The mobile web frontend for couriers must use local offline storage (IndexedDB/Service Workers) to queue status updates during internet drops, preserving the original event timestamp for when connection returns.

### Security & Compliance
- Customer coordinates and financial records must be encrypted at the database level to comply with UU PDP No. 27 Tahun 2022.
- No hardcoded API Keys or branch coordinates are allowed.
