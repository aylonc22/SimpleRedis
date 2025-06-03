// src/store.ts

type ValueEntry = {
  value: string;
  expiresAt?: number; // timestamp in ms
};

export class MemoryStore {
  private store: Map<string, ValueEntry> = new Map();

  set(key: string, value: string, ttlSeconds?: number): string {
    const entry: ValueEntry = { value };
    if (ttlSeconds) {
      entry.expiresAt = Date.now() + ttlSeconds * 1000;
    }
    this.store.set(key, entry);
    return 'OK';
  }

  get(key: string): string | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  del(key: string): number {
    return this.store.delete(key) ? 1 : 0;
  }

  clear(){
    this.store.clear();
  }

  exists(key: string): number {
    const value = this.get(key);
    return value !== null ? 1 : 0;
  }

   expire(key: string, ttlSeconds: number): number {
    const entry = this.store.get(key);
    if (!entry) return 0;

    entry.expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, entry);
    return 1;
  }

  incr(key: string): string {
    const current = this.get(key);
    const num = current ? parseInt(current, 10) : 0;
    const next = num + 1;
    this.set(key, next.toString());
    return next.toString();
  }

  keys(): string[] {
  const validKeys: string[] = [];
  for (const [key, entry] of this.store.entries()) {
    if (!entry.expiresAt || Date.now() <= entry.expiresAt) {
      validKeys.push(key);
    }
  }
  return validKeys;
}
}
