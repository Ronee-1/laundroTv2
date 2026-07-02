export interface QueuedAction {
  id: string;
  id_order: string;
  new_status: string;
  original_timestamp: string;
  queued_at: string;
  synced: boolean;
}

export interface QueuedLogisticsAction {
  id: string;
  logistics_id: string;
  action: 'start-route' | 'handover';
  original_timestamp: string;
  queued_at: string;
  synced: boolean;
}

const QUEUE_KEY = 'laundrot_offline_queue';
const LOGISTICS_QUEUE_KEY = 'laundrot_logistics_queue';

export function getQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedAction[];
  } catch {
    return [];
  }
}

export function addToQueue(action: Omit<QueuedAction, 'id' | 'queued_at' | 'synced'>): QueuedAction {
  const queue = getQueue();
  const newAction: QueuedAction = {
    ...action,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    queued_at: new Date().toISOString(),
    synced: false,
  };

  queue.push(newAction);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return newAction;
}

export function removeFromQueue(id: string): void {
  const queue = getQueue().filter((a) => a.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function markAsSynced(id: string): void {
  const queue = getQueue();
  const action = queue.find((a) => a.id === id);
  if (action) {
    action.synced = true;
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
}

export function clearSyncedActions(): void {
  const queue = getQueue().filter((a) => !a.synced);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function syncQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getQueue().filter((a) => !a.synced);
  let synced = 0;
  let failed = 0;

  for (const action of queue) {
    try {
      const res = await fetch(`/api/orders/${action.id_order}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action.new_status,
          original_timestamp: action.original_timestamp,
        }),
      });

      if (res.ok) {
        markAsSynced(action.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  if (synced > 0) {
    clearSyncedActions();
  }

  return { synced, failed };
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function getLogisticsQueue(): QueuedLogisticsAction[] {
  try {
    const raw = localStorage.getItem(LOGISTICS_QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedLogisticsAction[];
  } catch {
    return [];
  }
}

export function addToLogisticsQueue(action: Omit<QueuedLogisticsAction, 'id' | 'queued_at' | 'synced'>): QueuedLogisticsAction {
  const queue = getLogisticsQueue();
  const newAction: QueuedLogisticsAction = {
    ...action,
    id: `lqueue-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    queued_at: new Date().toISOString(),
    synced: false,
  };
  queue.push(newAction);
  localStorage.setItem(LOGISTICS_QUEUE_KEY, JSON.stringify(queue));
  return newAction;
}

export function markLogisticsAsSynced(id: string): void {
  const queue = getLogisticsQueue();
  const action = queue.find((a) => a.id === id);
  if (action) {
    action.synced = true;
    localStorage.setItem(LOGISTICS_QUEUE_KEY, JSON.stringify(queue));
  }
}

export function clearSyncedLogisticsActions(): void {
  const queue = getLogisticsQueue().filter((a) => !a.synced);
  localStorage.setItem(LOGISTICS_QUEUE_KEY, JSON.stringify(queue));
}

export async function syncLogisticsQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getLogisticsQueue().filter((a) => !a.synced);
  let synced = 0;
  let failed = 0;

  for (const action of queue) {
    try {
      const res = await fetch(`/api/logistics/${action.logistics_id}/${action.action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_timestamp: action.original_timestamp }),
      });

      if (res.ok) {
        markLogisticsAsSynced(action.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  if (synced > 0) {
    clearSyncedLogisticsActions();
  }

  return { synced, failed };
}
