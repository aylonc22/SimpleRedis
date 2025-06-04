// src/store.ts

type ValueEntry = {
  value: string;
  expiresAt?: number; // timestamp in ms
};

export class MemoryStore {
  private store: Map<string, ValueEntry> = new Map();
  
  export(): Record<string, ValueEntry> {
    return Object.fromEntries(this.store);
  }

  import(data: Record<string, ValueEntry>): void {
    this.store = new Map(Object.entries(data));
  }

  set(key: string, value: string, ttlSeconds?: number): string {
    const entry: ValueEntry = { value };
    if (ttlSeconds) {
      entry.expiresAt = Date.now() + ttlSeconds * 1000;
    }
    this.store.set(key, entry);
    return 'OK';
  }

  ttl(key:string){
     const entry = this.store.get(key);
     if(!entry) return -2; // key doesn't exist
     if (!entry?.expiresAt) return -1; // no expiration

     const ttl = Math.floor((entry?.expiresAt - Date.now()) / 1000);
     return ttl > 0 ? ttl : -2; // if expired return -2
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

  decr(key: string): string {
    const current = this.get(key);
    const num = current ? parseInt(current, 10) : 0;
    const next = num - 1;
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
