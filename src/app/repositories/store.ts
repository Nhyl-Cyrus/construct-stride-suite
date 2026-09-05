// Reactive collection store used by the mock repositories.
// It keeps the same async interface the future Express/PostgreSQL API will
// expose, so repositories can swap `insert` for `POST /api/...` without any
// change in the services, controllers or views above them.

type Listener = () => void;

export interface Collection<T> {
  subscribe(listener: Listener): () => void;
  getSnapshot(): T[];
  list(): Promise<T[]>;
  insert(item: T): Promise<T>;
  update(match: (item: T) => boolean, patch: Partial<T>): Promise<T | undefined>;
  reset(): void;
}

const EMPTY: readonly unknown[] = Object.freeze([]);

function storageKey(key: string) {
  return `easyconstruct:${key}`;
}

export function createCollection<T>(key: string): Collection<T> {
  let items: T[] | null = null;
  const listeners = new Set<Listener>();

  const load = (): T[] => {
    if (items) return items;
    if (typeof window === "undefined") return EMPTY as unknown as T[];
    try {
      const raw = window.localStorage.getItem(storageKey(key));
      items = raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      items = [];
    }
    return items;
  };

  const persist = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey(key), JSON.stringify(items ?? []));
    } catch {
      /* quota / private mode — in-memory state still works */
    }
  };

  const emit = () => listeners.forEach((l) => l());

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return load();
    },
    async list() {
      return load();
    },
    async insert(item) {
      items = [item, ...load()];
      persist();
      emit();
      return item;
    },
    async update(match, patch) {
      const current = load();
      let updated: T | undefined;
      items = current.map((it) => {
        if (updated || !match(it)) return it;
        updated = { ...it, ...patch };
        return updated;
      });
      if (updated) {
        persist();
        emit();
      }
      return updated;
    },
    reset() {
      items = [];
      persist();
      emit();
    },
  };
}

/** Simple id helper shared by the mock repositories. */
export function newId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${rand}`;
}
